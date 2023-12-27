import User, { Roles } from '../../models/User';
import InputRegisterUser from '../../models/inputRegisterUser';
import InputLoginUser from '../../models/inputLoginUser';
import * as dotenv from 'dotenv';

import bcrypt from 'bcrypt';
dotenv.config();

export default class UserTestBuilder {
    private readonly _id: number | null = 1;
    private _email: string = 'email@email.com';
    private _username: string = 'usertest';
    private _password: string = '_qyU1)"v@2^9';
    private readonly _roles: Roles | null = null;
    private readonly _refresh_token: string | null = null;
    private readonly _created_at: Date = new Date('2022-12-17T03:24:00');
    private readonly _updated_at: Date | null = null;

    buildUser(): User {
        return new User(this._id, this._email, this._username, this._roles, this._created_at, this._updated_at);
    }

    buildUserWithPassword(): User & { password: string } {
        const user = new User(this._id, this._email, this._username, this._roles, this._created_at, this._updated_at);
        return {
            ...user,
            password: this.hashPassword(this._password),
        };
    }

    buildInputRegisterUser(): InputRegisterUser {
        return new InputRegisterUser(this._email, this._username, this._password);
    }

    buildInputLoginUser(): InputLoginUser {
        return new InputLoginUser(this._email, this._password);
    }

    withEmail(email: string): UserTestBuilder {
        this._email = email;
        return this;
    }

    withUsername(username: string): UserTestBuilder {
        this._username = username;
        return this;
    }

    withPassword(password: string): UserTestBuilder {
        this._password = password;
        return this;
    }

    withHashPassword(password: string): void {
        this._password = this.hashPassword(password);
    }

    hashPassword(password: string): string {
        return bcrypt.hashSync(password, parseInt(process.env.ROUND_SALT_PWD));
    }
}
