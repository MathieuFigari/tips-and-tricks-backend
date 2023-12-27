import { Sql } from 'postgres';
import InputRegisterUser from '../../../user/domain/models/inputRegisterUser';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export default class UsersFixtures {
    constructor(private readonly _sql: Sql) {}

    public async givenSomeUsers(count: number) {
        const users: InputRegisterUser[] = [];

        while (count--) {
            users.push(
                new InputRegisterUser(
                    `user${count}@user.com`,
                    faker.internet.userName(),
                    bcrypt.hashSync('Test123456789!', 10),
                ),
            );
        }

        await this._sql`insert into "user" ${this._sql(users)}`.then((rows) => rows.length);
    }
}
