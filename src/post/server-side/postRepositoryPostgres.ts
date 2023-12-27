import PostRepositoryInterface from '../domain/ports/postRepositoryInterface';
import Post, { PostFullData } from '../domain/model/post';
import { Row, Sql } from 'postgres';
import InputCreatePost from '../domain/model/inputCreatePost';

export default class PostRepositoryPostgres implements PostRepositoryInterface {
    constructor(private readonly _sql: Sql) {}

    async create(input: InputCreatePost & { slug: string }): Promise<Post> {
        return await this._sql`
            insert into "post" ${this._sql(input)} returning *`.then((rows) => {
            if (rows.length > 0) {
                return PostRepositoryPostgresFactory.create(rows[0]);
            }
            return null;
        });
    }

    async getList(start: number, length: number): Promise<PostFullData[]> {
        return await this._sql`
            select p.*,
                   u.username,
                   (select count(*) from "reaction" r where r."post_id" = p."id" and r."reaction" = 'like') as "like",
                   (select count(*) from "reaction" r where r."post_id" = p."id" and r."reaction" = 'dislike') as "dislike"
            from "post" p
                     join "user" u on u."id" = p."user_id"
            order by p."created_at" desc, p."id"
            offset ${start}
            limit ${length}`.then((rows) => {
            if (rows.length > 0) {
                return rows.map((row) => {
                    return {
                        ...PostRepositoryPostgresFactory.create(row),
                        username: row.username,
                    };
                });
            }
            return [];
        });
    }

    async getPost(postId: number): Promise<PostFullData | null> {
        return this._sql`
                select p.*, 
                u.username,
               (select count(*) from "reaction" r where r."post_id" = p."id" and r."reaction" = 'like') as "like",
               (select count(*) from "reaction" r where r."post_id" = p."id" and r."reaction" = 'dislike') as "dislike"
                from "post" p
        join "user" u on u."id" = p."user_id"
        where p."id" = ${postId}`.then((rows) => {
            if (rows.length > 0) {
                return {
                    ...PostRepositoryPostgresFactory.create(rows[0]),
                    username: rows[0].username,
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
