import ReactionRepositoryInterface from '../domain/port/ReactionRepositoryInterface';
import Reaction, { ReactionType } from '../domain/model/reaction';
import { Row, Sql } from 'postgres';

export default class ReactionRepositoryPostgres implements ReactionRepositoryInterface {
    constructor(private readonly _sql: Sql) {}
    async addReaction(user_id: number, post_id: number, reaction: ReactionType): Promise<Reaction | null> {
        const reactionSql: Reaction = {
            user_id: user_id,
            post_id: post_id,
            reaction: reaction,
        };
        return await this._sql`
            insert into "reaction" ${this._sql(reactionSql)} returning *`.then((rows) => {
            if (rows.length > 0) {
                return ReactionRepositoryPostgresFactory.create(rows[0]);
            }
            return null;
        });
    }

    async getAllReactionsForPost(post_id: number): Promise<{ likes: number; dislikes: number }> {
        const likes = await this
            ._sql`select count(*) from "reaction" where "post_id" = ${post_id} and "reaction" = 'like'`;
        const dislikes = await this
            ._sql`select count(*) from "reaction" where "post_id" = ${post_id} and "reaction" = 'dislike'`;
        return {
            likes: likes[0].count,
            dislikes: dislikes[0].count,
        };
    }

    async reactionExist(user_id: number, post_id: number): Promise<Reaction | null> {
        return await this._sql`
            select * from "reaction" where "user_id" = ${user_id} and "post_id" = ${post_id}`.then((rows) => {
            if (rows.length > 0) {
                return ReactionRepositoryPostgresFactory.create(rows[0]);
            }
            return null;
        });
    }

    async removeReaction(user_id: number, post_id: number): Promise<boolean> {
        return await this._sql`
            delete from "reaction" where "user_id" = ${user_id} and "post_id" = ${post_id} returning *`.then((rows) => {
            return rows.length > 0;
        });
    }

    async getReactionForCurrentUser(userId: number, postId: number): Promise<ReactionType | null> {
        return await this
            ._sql`select reaction from "reaction" where "user_id" = ${userId} and "post_id" = ${postId}`.then(
            (rows) => {
                if (rows.length > 0) {
                    return rows[0].reaction;
                }
                return null;
            },
        );
    }
}

export class ReactionRepositoryPostgresFactory {
    static create(row: Row): Reaction {
        return new Reaction(row.user_id, row.post_id, row.reaction);
    }
}
