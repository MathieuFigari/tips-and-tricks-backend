import UserRepositoryInterface from '../../domain/ports/userRepositoryInterface';
import InputRegisterUser from '../../domain/models/inputRegisterUser';
import User from '../../domain/models/User';
import { Row, Sql } from 'postgres';

export default class UserRepositoryPostgres implements UserRepositoryInterface {
    constructor(private readonly _sql: Sql) {}
    async create(input: InputRegisterUser): Promise<User | null> {
        return this._sql`insert into "user" ${this._sql(
            input,
        )} returning id, email, username, roles, created_at, updated_at`.then((rows) => {
            if (rows.length > 0) {
                return UserRepositoryPostgresFactory.create(rows[0]);
            }
            return null;
        });
    }

    async getByEmail(email: string): Promise<User & { password: string; refresh_token?: string | null }> {
        return this._sql`select * from "user" where "email" = ${email}`.then((rows) => {
            if (rows.length > 0) {
                return {
                    ...UserRepositoryPostgresFactory.create(rows[0]),
                    password: rows[0].password as string,
                    refresh_token: rows[0].refresh_token as string,
                };
            }
            return null;
        });
    }

    async getByUsername(username: string): Promise<User> {
        const rows = await this._sql`select * from "user" where "username" = ${username}`;
        if (rows.length > 0) {
            return UserRepositoryPostgresFactory.create(rows[0]);
        }
        return null;
    }

    async revokeToken(email: string): Promise<boolean> {
        return await this._sql`update "user" u set "refresh_token" = null where u.email = ${email} returning id`.then(
            (rows) => rows.length > 0,
        );
    }

    async setRefreshToken(userId: number, refreshToken: string): Promise<boolean> {
        return await this
            ._sql`update "user" u set "refresh_token" = ${refreshToken} where u.id = ${userId} returning id`.then(
            (rows) => rows.length > 0,
        );
    }
}

export class UserRepositoryPostgresFactory {
    static create(row: Row): User {
        return new User(row.id, row.email, row.username, row.roles, row.created_at, row.updated_at);
    }
}
