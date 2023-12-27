import { Sql } from 'postgres';
import { faker } from '@faker-js/faker';
import InputCreatePost from '../../../post/domain/model/inputCreatePost';

export default class PostsFixtures {
    constructor(private readonly _sql: Sql) {}

    public async givenSomePosts(count: number) {
        const posts: Array<InputCreatePost & { slug: string }> = [];
        const usersIds = await this._sql`select "id" from "user"`.then((rows) => rows);

        while (count--) {
            posts.push({
                ...new InputCreatePost(
                    faker.lorem.words(3),
                    faker.lorem.text(),
                    faker.lorem.text(),
                    faker.lorem.text(),
                    usersIds[Math.floor(Math.random() * usersIds.length)].id,
                ),
                slug: faker.lorem.slug(),
            });
        }

        await this._sql`insert into "post" ${this._sql(posts)}`.then((rows) => rows.length);
    }
}
