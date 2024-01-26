import PostRepositoryInterface from '../domain/ports/postRepositoryInterface';
import Post, { PostFullData } from '../domain/model/post';
import Tag from '../../tag/domain/model/tag';
import { Row, Sql } from 'postgres';
import InputCreatePost from '../domain/model/inputCreatePost';

export default class PostRepositoryPostgres implements PostRepositoryInterface {
    constructor(private readonly _sql: Sql) {}

    async create(input: InputCreatePost & { slug: string; tags: Tag[] }): Promise<Post> {
        const transaction = await this._sql.begin(async (sql) => {
            const rows = await sql`
                insert into "post" ${sql(input, 'title', 'message', 'description', 'slug', 'user_id', 'command')} 
                returning *`;

            if (rows.length > 0) {
                const post: Post = PostRepositoryPostgresFactory.create(rows[0]);
                await Promise.all(
                    input.tags.map(
                        (tag) => sql`insert into post_tags ("post_id", "tag_id") values (${post.id}, ${tag.id})`,
                    ),
                );
                return post;
            }
        });
        return transaction;
    }

    async getList(
        start: number,
        length: number,
        tagId?: number,
        search?: string,
    ): Promise<{ posts: PostFullData[]; totalCount: number }> {
        const Coefficient = 0.2;
        const FreshnessCoefficient = 0.15;
        const query = this._sql`
            SELECT 
        p.*,
        u.username,
        COALESCE(
            (
                SELECT json_agg(json_build_object('id', t.id, 'label', t.label))
                FROM tag t
                JOIN post_tags pt ON pt.tag_id = t.id
                WHERE pt.post_id = p.id
            ),
            '[]'
        ) AS tags,
        (
            SELECT count(*)
            FROM "reaction" r
            WHERE r."post_id" = p."id" AND r."reaction" = 'like'
        ) AS "like",
        (
            SELECT count(*)
            FROM "reaction" r
            WHERE r."post_id" = p."id" AND r."reaction" = 'dislike'
        ) AS "dislike",
        (SELECT count(*) FROM "comment" c WHERE c."post_id" = p.id) AS comment_count,
        CAST((SELECT count(*) FROM "reaction" r WHERE r."post_id" = p."id" AND r."reaction" = 'like') AS numeric) - 
      CAST((SELECT count(*) FROM "reaction" r WHERE r."post_id" = p."id" AND r."reaction" = 'dislike') AS numeric) +
      (${Coefficient} * CAST((SELECT count(*) FROM "comment" c WHERE c."post_id" = p.id) AS numeric)) +
      (1 / (DATE_PART('day', NOW() - p.published_at) + ${FreshnessCoefficient})) AS total_score
    FROM 
        "post" p
    JOIN 
        "user" u ON u."id" = p."user_id"
    JOIN 
        "post_tags" pt ON p.id = pt.post_id
    JOIN 
        "tag" t ON pt.tag_id = t.id
    ${
        tagId
            ? this._sql`WHERE p.id IN (
        SELECT pt.post_id 
        FROM post_tags pt 
        WHERE pt.tag_id = ${tagId}
    )`
            : this._sql``
    }
    ${
        search
            ? this
                  ._sql`AND (p.title ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`} OR p.message ILIKE ${`%${search}%`})`
            : this._sql``
    }
    GROUP BY p.id, u.id
    ORDER BY 
        total_score DESC, p.id
    OFFSET ${start} LIMIT ${length}`;

        const posts = await query.then((rows) =>
            rows.map((row) => ({
                ...PostRepositoryPostgresFactory.create(row),
                username: row.username,
                tags: row.tags,
                like: row.like,
                dislike: row.dislike,
                comment_count: row.comment_count,
            })),
        );

        const totalCount = await this._sql`select COUNT(DISTINCT p.id)
        as total from "post" p
        join "user" u on u."id" = p."user_id"
        join "post_tags" pt on p.id = pt."post_id"
        join tag t on pt.tag_id = t."id"
        ${
            tagId
                ? this._sql`where p.id in(
            select pt.post_id
            from post_tags pt
            where pt.tag_id = ${tagId}
        )`
                : this._sql``
        }
        ${
            search
                ? this._sql`AND (p."title" ILIKE ${`%${search}%`}
        OR p."description" ILIKE ${`%${search}%`}
        OR p."message" ILIKE ${`%${search}%`})`
                : this._sql``
        }
    `.then((rows) => {
            return rows[0].total;
        });

        return { posts, totalCount };
    }

    async getPost(postId: number): Promise<PostFullData | null> {
        return this._sql`
            SELECT 
                p.*,
                u.username,
                COALESCE(json_agg(json_build_object('id', tag.id, 'label', tag.label)) FILTER (WHERE tag.id IS NOT NULL), '[]') AS tags,
                (SELECT count(*) FROM "reaction" r WHERE r."post_id" = p."id" AND r."reaction" = 'like') AS "like",
                (SELECT count(*) FROM "reaction" r WHERE r."post_id" = p."id" AND r."reaction" = 'dislike') AS "dislike",
                (SELECT count(*) FROM "comment" c WHERE c."post_id" = p.id) AS comment_count
            FROM 
                "post" p
            JOIN "user" u ON u."id" = p."user_id"
            LEFT JOIN "post_tags" pt ON p.id = pt.post_id
            LEFT JOIN "tag" tag ON pt.tag_id = tag.id
            WHERE 
                p."id" = ${postId}
            GROUP BY 
                p.id, u.id`.then((rows) => {
            if (rows.length > 0) {
                return {
                    ...PostRepositoryPostgresFactory.create(rows[0]),
                    username: rows[0].username,
                    tags: rows[0].tags.map((tag) => ({ id: tag.id, label: tag.label })),
                    comment_count: rows[0].comment_count,
                };
            }

            return null;
        });
    }
}

export class PostRepositoryPostgresFactory {
    static create(row: Row): Post {
        return new Post(
            row.id,
            row.user_id,
            row.title,
            row.slug,
            row.description,
            row.message,
            row.command,
            row.tags,
            {
                like: row.like,
                dislike: row.dislike,
            },
            row.published_at,
            row.created_at,
            row.updated_at,
        );
    }
}
