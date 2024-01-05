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
        const FreshnessCoefficient = 10;
        let query = `
        SELECT 
            p.*,
            u.username,
            COALESCE(json_agg(json_build_object('id', tag.id, 'label', tag.label)) FILTER (WHERE tag.id IS NOT NULL), '[]') AS tags,
            (SELECT count(*) FROM "reaction" r WHERE r."post_id" = p."id" AND r."reaction" = 'like') AS "like",
            (SELECT count(*) FROM "reaction" r WHERE r."post_id" = p."id" AND r."reaction" = 'dislike') AS "dislike",
            (SELECT count(*) FROM "comment" c WHERE c."post_id" = p.id) AS comment_count,
            ((SELECT count(*) FROM "reaction" r WHERE r."post_id" = p."id" AND r."reaction" = 'like') - 
            (SELECT count(*) FROM "reaction" r WHERE r."post_id" = p."id" AND r."reaction" = 'dislike') +
            (${Coefficient} * (SELECT count(*) FROM "comment" c WHERE c."post_id" = p.id))) +
            (1 / (DATE_PART('hour', NOW() - p.published_at) + 0.02)) +
            CASE WHEN NOW() - p.published_at < INTERVAL '24 hours' THEN ${FreshnessCoefficient} ELSE 0 END AS total_score
        FROM 
            "post" p
        JOIN "user" u ON u."id" = p."user_id"
        LEFT JOIN "post_tags" pt ON p.id = pt.post_id
        LEFT JOIN "tag" tag ON pt.tag_id = tag.id
    `;

        const whereClauses = [];
        if (search) {
            whereClauses.push(
                `(p.title ILIKE '%${search}%' OR p.description ILIKE '%${search}%' OR p.message ILIKE '%${search}%')`,
            );
        }
        if (tagId) {
            whereClauses.push(`p.id IN (SELECT post_id FROM post_tags WHERE tag_id = ${tagId})`);
        }

        if (whereClauses.length) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }

        query += `
        GROUP BY p.id, u.id
        ORDER BY total_score DESC, p.id
        OFFSET ${start} LIMIT ${length}
    `;

        let countQuery = `
        SELECT COUNT(*) FROM "post" p
        LEFT JOIN "post_tags" pt ON p.id = pt.post_id
        LEFT JOIN "tag" tag ON pt.tag_id = tag.id
    `;

        if (whereClauses.length) {
            countQuery += ' WHERE ' + whereClauses.join(' AND ');
        }

        const totalCountResult = await this._sql.unsafe(countQuery);
        const totalCount = parseInt(totalCountResult[0].count, 10);
        const postsWithTags = await this._sql.unsafe(query);

        const posts = postsWithTags.map((row) => ({
            ...PostRepositoryPostgresFactory.create(row),
            username: row.username,
            tags: row.tags.map((tag) => ({ id: tag.id, label: tag.label })),
            comment_count: row.comment_count,
        }));

        return { posts, totalCount };
    }

    async getPost(postId: number): Promise<PostFullData | null> {
        const query = `
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
                p.id, u.id`;

        const rows = await this._sql.unsafe(query);

        if (rows.length > 0) {
            return {
                ...PostRepositoryPostgresFactory.create(rows[0]),
                username: rows[0].username,
                tags: rows[0].tags.map((tag) => ({ id: tag.id, label: tag.label })),
                comment_count: rows[0].comment_count,
            };
        }

        return null;
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
