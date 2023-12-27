import UserRepositoryInterface from '../../domain/ports/userRepositoryInterface';
import InputRegisterUser from '../../domain/models/inputRegisterUser';
import User from '../../domain/models/User';
import * as dotenv from 'dotenv';
dotenv.config();

export type UserWithPassword = User & { password: string };

export default class UserRepositoryInMemory implements UserRepositoryInterface {
    private _usersInMemory: Array<User & { password?: string; refresh_token?: string | null }> = [];
    private _password: string;
    private _error: boolean = false;

    async create(input: InputRegisterUser): Promise<User | null> {
        if (!this._error) {
            this._usersInMemory.push(
                new User(1, input.email, input.username, null, new Date('2022-12-17T03:24:00'), null),
            );
            this._password = input.password;
            return this._usersInMemory[0];
        }
        return null;
    }

    async getByEmail(email: string): Promise<User & { password?: string; refresh_token?: string | null }> {
        return this._usersInMemory.find((user: User & { password: string }) => user.email === email);
    }

    async getByUsername(username: string): Promise<User> {
        return this._usersInMemory.find((user: User) => user.username === username);
    }

    async setRefreshToken(userId: number, refreshToken: string): Promise<boolean> {
        const user = this._usersInMemory.find((user) => user.id === userId);
        if (!user) return false;
        user.refresh_token = refreshToken;
        return true;
    }

    async revokeToken(email: string): Promise<boolean> {
        const user = this._usersInMemory.find((user: User & { password: string }) => user.email === email);
        if (!user) return false;
        user.refresh_token = null;
        return true;
    }

    setUser(user: User): UserRepositoryInMemory {
        this._usersInMemory.push(user);
        return this;
    }

    setError(): UserRepositoryInMemory {
        this._error = true;
        return this;
    }

    clear(): UserRepositoryInMemory {
        this._usersInMemory = [];
        return this;
    }

    getPassword(): string {
        return this._password;
    }
}
