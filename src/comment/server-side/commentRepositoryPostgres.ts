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
        const query = `
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

        const comments = await this._sql.unsafe(query);

        const totalCountQuery = `
        SELECT COUNT(*)
        FROM "comment"
        WHERE "post_id" = ${postId}
    `;
        const totalCountResult = await this._sql.unsafe(totalCountQuery);
        const totalCount = parseInt(totalCountResult[0].count, 10);

        return {
            comments: comments.map((row) => ({
                ...CommentRepositoryPostgresFactory.create(row),
                username: row.username,
            })),
            totalCount: totalCount,
        };
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
