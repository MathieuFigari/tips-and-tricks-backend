import { Sql } from 'postgres';
import Reaction, { ReactionType } from '../../../reaction/domain/model/reaction';

export default class ReactionsFixtures {
    constructor(private readonly _sql: Sql) {}

    public async givenSomeReactions() {
        const reactions: Reaction[] = [];
        const usersIds = await this._sql`select "id" from "user"`.then((rows) => rows);
        const postsIds = await this._sql`select "id" from "post"`.then((rows) => rows);
        for (const postId of postsIds) {
            for (const userId of usersIds) {
                const randomValue = Math.random();
                if (randomValue < 0.33) {
                    reactions.push({
                        post_id: postId.id,
                        user_id: userId.id,
                        reaction: ReactionType.like,
                    });
                } else if (randomValue < 0.66) {
                    reactions.push({
                        post_id: postId.id,
                        user_id: userId.id,
                        reaction: ReactionType.dislike,
                    });
                }
            }
        }

        await this._sql`insert into "reaction" ${this._sql(reactions)}`.then((rows) => rows.length);
    }
}
