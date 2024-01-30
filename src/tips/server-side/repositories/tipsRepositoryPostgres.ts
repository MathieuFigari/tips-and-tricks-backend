import Tips from '../../domain/models/Tips';
import Tag from '../../../tag/domain/model/tag';
import { Row, Sql } from 'postgres';
import TipsRepositoryInterface from '../../domain/ports/tipsRepositoryInterface';
import InputCreateTips from '../../domain/models/inputCreateTips';
import InputUpdateTips from '../../domain/models/InputUpdateTips';

export default class TipsRepositoryPostgres implements TipsRepositoryInterface {
    constructor(private readonly _sql: Sql) {}

    async create(input: InputCreateTips): Promise<Tips | null> {
        const description = input.description === '' ? null : input.description;
        let createdTip: Tips | null;

        const createdTipsResult = await this._sql`INSERT INTO "tips" (title, command, description, user_id)
            VALUES (${input.title}, ${input.command}, ${description}, ${input.user_id})
            RETURNING *`;

        if (createdTipsResult.count === 1) {
            createdTip = TipsRepositoryPostgresFactory.create(createdTipsResult[0]);

            for (const tag of input.tags) {
                await this._sql`INSERT INTO "tips_tags" (tips_id, tag_id) VALUES (${createdTip.id}, ${tag.id})`;
            }

            createdTip = await this.getFullTip(createdTip.id);
        }

        return createdTip;
    }

    async update(input: InputUpdateTips): Promise<Tips | null> {
        let updatedTip: Tips | null;

        const updatedTipsResult = await this._sql`UPDATE "tips" 
            SET title = ${input.title}, command = ${input.command}, description = ${input.description}
            WHERE id = ${input.id} AND user_id = ${input.user_id}
            RETURNING *`;

        if (updatedTipsResult.count === 1) {
            updatedTip = TipsRepositoryPostgresFactory.create(updatedTipsResult[0]);
            await this._sql`DELETE FROM "tips_tags" WHERE tips_id = ${updatedTip.id}`;
            for (const tag of input.tags) {
                await this._sql`INSERT INTO "tips_tags" (tips_id, tag_id) VALUES (${updatedTip.id}, ${tag.id})`;
            }
            updatedTip = await this.getFullTip(updatedTip.id);
        }

        return updatedTip;
    }

    async getList(
        userId: number,
        page: number,
        length: number,
        tagId?: number,
    ): Promise<{ tips: Tips[]; total: number }> {
        const start = (page - 1) * length;

        const query = this._sql`
        SELECT 
        ti.*,
        (
            SELECT json_agg(json_build_object('id', t.id, 'label', t.label))
            FROM tag t
            JOIN tips_tags tt ON tt.tag_id = t.id
            WHERE tt.tips_id = ti.id
            ) AS tags 
    FROM 
        "tips" ti
    WHERE 
        ti."user_id" = ${userId}
        ${
            tagId
                ? this._sql`AND ti.id IN (
            SELECT tt2.tips_id 
            FROM tips_tags tt2 
            WHERE tt2.tag_id = ${tagId}
        )`
                : this._sql``
        }
    GROUP BY ti.id
    ORDER BY ti.published_at DESC, ti.id
    OFFSET ${start} LIMIT ${length}`;

        const tips = await query.then((rows) =>
            rows.map(
                (row) =>
                    new Tips(
                        row.id,
                        row.user_id,
                        row.title,
                        row.command,
                        row.description,
                        row.tags.map((tag: Tag) => new Tag(tag.id, tag.label, tag.created_at, tag.updated_at)),
                        row.published_at,
                        row.created_at,
                        row.updated_at,
                    ),
            ),
        );

        const total = await this._sql`SELECT COUNT(DISTINCT ti.id) AS total
        FROM "tips" ti 
        JOIN "user" u ON u."id" = ti."user_id"
        WHERE ti."user_id" = ${userId}
        ${
            tagId
                ? this._sql`AND ti.id IN (
            SELECT tt.tips_id 
            FROM tips_tags tt 
            WHERE tt.tag_id = ${tagId}
        )`
                : this._sql``
        }
        `.then((rows) => {
            return rows[0].total;
        });

        return { tips, total };
    }

    async delete(userId: number, tipsId: number): Promise<boolean> {
        return this._sql`DELETE FROM "tips" WHERE "id" = ${tipsId} AND "user_id" = ${userId}`.then((rows) => {
            if (rows.count === 0) {
                return false;
            }
            return true;
        });
    }

    async getFullTip(tipId: number): Promise<Tips | null> {
        const fullTipResult = await this._sql`
            SELECT tips.*, json_agg(tag.*) as tags
            FROM "tips"
            LEFT JOIN "tips_tags" ON tips.id = tips_tags.tips_id
            LEFT JOIN "tag" ON tips_tags.tag_id = tag.id
            WHERE tips.id = ${tipId}
            GROUP BY tips.id`;

        if (fullTipResult.count === 1) {
            return TipsRepositoryPostgresFactory.create(fullTipResult[0]);
        }

        return null;
    }
}

export class TipsRepositoryPostgresFactory {
    static create(row: Row): Tips {
        return new Tips(
            row.id,
            row.user_id,
            row.title,
            row.command,
            row.description,
            row.tags,
            row.published_at,
            row.created_at,
            row.updated_at,
        );
    }
}
