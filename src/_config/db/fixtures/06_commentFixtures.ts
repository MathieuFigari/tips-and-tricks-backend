import { Sql } from 'postgres';
import { faker } from '@faker-js/faker';

export default class CommentFixtures {
    constructor(private readonly _sql: Sql) {}

    public async givenCommentsForEveryPostAndUser() {
        // Récupérez tous les ID des posts et des utilisateurs
        const postsIds = await this._sql`SELECT id FROM post`.then((rows) => rows.map((row) => row.id));
        const usersIds = await this._sql`SELECT id FROM "user"`.then((rows) => rows.map((row) => row.id));

        // Pour chaque combinaison de post et utilisateur, créez un commentaire
        for (const postId of postsIds) {
            for (const userId of usersIds) {
                const content = faker.lorem.sentences();
                const published_at = faker.date.recent();

                await this._sql`
                    INSERT INTO comment (content, published_at, post_id, user_id)
                    VALUES (${content}, ${published_at}, ${postId}, ${userId})
                `;
            }
        }
    }
}
