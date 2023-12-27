import Tips from '../../domain/models/Tips';
import { Row, Sql } from 'postgres';
import TipsRepositoryInterface, { TipsList } from '../../domain/ports/tipsRepositoryInterface';
import InputCreateTips from '../../domain/models/inputCreateTips';
import InputUpdateTips from '../../domain/models/InputUpdateTips';

export default class TipsRepositoryPostgres implements TipsRepositoryInterface {
    constructor(private readonly _sql: Sql) {}

    async create(input: InputCreateTips): Promise<Tips | null> {
        return this._sql`insert into "tips" ${this._sql(
            input,
        )} returning id, user_id, title, command, description, published_at, created_at, updated_at`.then((rows) => {
            if (rows.length > 0) {
                return TipsRepositoryPostgresFactory.create(rows[0]);
            }
            return null;
        });
    }

    async update(input: InputUpdateTips): Promise<Tips> {
        return this._sql`update "tips" set ${this._sql(input)}  where "id" = ${input.id} and "user_id" = ${
            input.user_id
        }
            returning id, user_id, title, command, description, published_at, created_at, updated_at`.then((rows) => {
            if (rows.length > 0) {
                return TipsRepositoryPostgresFactory.create(rows[0]);
            }
            return null;
        });
    }

    async getList(userId: number, page: number, length: number): Promise<TipsList> {
        const start = length * (page - 1);

        const total = await this._sql`select count(*) as total from "tips" where "user_id" = ${userId}`.then((rows) => {
            return rows[0].total;
        });

        const tips = await this._sql`
            select * from "tips"  where "user_id" = ${userId} order by "id" offset ${start} limit ${length}`.then(
            (rows) => {
                if (rows.length > 0) {
                    return rows.map((row) => TipsRepositoryPostgresFactory.create(row));
                }
                return [];
            },
        );

        return { tips, total } as TipsList;
    }

    async delete(userId: number, tipsId: number): Promise<boolean> {
        return this._sql`DELETE FROM "tips" WHERE "id" = ${tipsId} AND "user_id" = ${userId}`.then((rows) => {
            if (rows.count === 0) {
                return false;
            }
            return true;
        });
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
            row.published_at,
            row.created_at,
            row.updated_at,
        );
    }
}
