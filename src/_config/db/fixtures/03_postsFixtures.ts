import { Sql } from 'postgres';
import { faker } from '@faker-js/faker';

export default class PostsFixtures {
    constructor(private readonly _sql: Sql) {}

    public async givenSomePosts(count: number) {
        const usersIds = await this._sql`SELECT "id" FROM "user"`.then((rows) => rows.map((row) => row.id));
        const tagsIds = await this._sql`SELECT "id" FROM "tag"`.then((rows) => rows.map((row) => row.id));

        for (let i = 0; i < count; i++) {
            const userId = usersIds[Math.floor(Math.random() * usersIds.length)];
            const newPostData = {
                title: faker.lorem.words(3),
                command: faker.lorem.words(5),
                description: faker.lorem.text(),
                slug: faker.lorem.slug(),
                user_id: userId,
            };

            const result = await this._sql`INSERT INTO "post" ${this._sql(newPostData)} RETURNING "id"`;

            if (result.count) {
                const newPostId = result[0].id;
                const numberOfTags = Math.min(3, Math.floor(Math.random() * tagsIds.length) + 1);
                const selectedTagsIds = tagsIds.sort(() => 0.5 - Math.random()).slice(0, numberOfTags);

                for (const tagId of selectedTagsIds) {
                    await this._sql`INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (${newPostId}, ${tagId})`;
                }
            }
        }
    }
}
