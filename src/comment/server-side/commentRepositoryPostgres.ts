import Comment, { CommentFullData } from '../domain/model/comment';
import CommentRepositoryInterface from '../domain/port/commentRepositoryInterface';
import { Row, Sql } from 'postgres';
import InputCreateComment from '../domain/model/inputCreateComment';

export default class CommentRepositoryPostgres implements CommentRepositoryInterface {
    constructor(private readonly _sql: Sql) {}

    async getList(
        start: number,
        length: number,
        postId: number,
    ): Promise<{ comments: CommentFullData[]; totalCount: number }> {
        const query = this._sql`
            SELECT 
                c.*,
                u.username
            FROM 
                "comment" c
            JOIN "user" u ON u."id" = c."user_id"
            WHERE 
                c."post_id" = ${postId}
            ORDER BY 
                c."published_at" DESC
            OFFSET ${start} LIMIT ${length}
        `;

        const totalCount = await this._sql`select count(*) as total from "comment" where "post_id" = ${postId}`.then(
            (rows) => {
                return rows[0].total;
            },
        );

        const comments = await query.then((rows) =>
            rows.map((row) => ({
                ...CommentRepositoryPostgresFactory.create(row),
                username: row.username,
            })),
        );

        return { comments, totalCount };
    }

    async create(input: InputCreateComment, userName: string): Promise<CommentFullData> {
        const rows = await this._sql`
            INSERT INTO "comment" (content, user_id, post_id) 
            VALUES (${input.content}, ${input.user_id}, ${input.post_id})
            RETURNING *
        `;

        if (rows.length > 0) {
            const comment = CommentRepositoryPostgresFactory.create(rows[0]);
            return {
                ...comment,
                username: userName,
            };
        }

        throw new Error('Unable to create comment');
    }
}
export class CommentRepositoryPostgresFactory {
    static create(row: Row): Comment {
        return new Comment(
            row.id,
            row.user_id,
            row.post_id,
            row.content,
            row.published_at,
            row.created_at,
            row.updated_at,
        );
    }
}
