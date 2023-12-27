import UserRepositoryInMemory from '../../../server-side/repositories/userRepositoryInMemory';
import UserTestBuilder from './UserTestBuilder';
import InputLoginUser from '../../models/inputLoginUser';
import AuthUserUseCase from '../authUserUseCase';
import User, { JwtToken, UserLogged } from '../../models/User';
import UserFactory from '../../factories/userFactory';
import { faker } from '@faker-js/faker';

describe('Login a user', () => {
    let userRepository: UserRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        userRepository = new UserRepositoryInMemory();
        sut = new SUT(userRepository);
    });

    describe('Login', () => {
        test('can login a user', async () => {
            const inputLoginUser = sut.givenAnInputLoginUser();
            const expectedUser = sut.givenAUser();
            const userLogged = (await new AuthUserUseCase(userRepository).login(inputLoginUser)) as UserLogged;
            expect(userLogged.user).toEqual(UserFactory.createWithoutPassword(expectedUser));
        });

        test("can throw an errors if the email doesn't exists in database", async () => {
            try {
                const inputLoginUser = sut.givenAnInputLoginUser();
                sut.givenAUserWithNotExistEmail();
                await new AuthUserUseCase(userRepository).login(inputLoginUser);
                //This expect breaks the test because it must throw an error
                expect(false).toEqual(true);
            } catch (err) {
                expect(err.message).toEqual('Login errors !');
            }
        });

        test('can throw an errors if the password is not ok', async () => {
            try {
                const inputLoginUser = sut.givenAnInputLoginUser();
                sut.givenAUserWithBadPassword();
                await new AuthUserUseCase(userRepository).login(inputLoginUser);
                //This expect breaks the test because it must throw an error
                expect(false).toEqual(true);
            } catch (err) {
                expect(err.message).toEqual('Login errors !');
            }
        });

        test('if a user is logged successfully, the server send an access_token and refresh_token and the refresh token is saved in DB  ', async () => {
            const inputLoginUser = sut.givenAnInputLoginUser();
            sut.givenAUser();

            const userLogged = (await new AuthUserUseCase(userRepository).login(inputLoginUser)) as UserLogged;
            expect(userLogged.tokens.access_token).not.toBeNull();
            expect(userLogged.tokens.refresh_token).not.toBeNull();

            const user = await userRepository.getByEmail(userLogged.user.email);
            expect(user.refresh_token).toEqual(userLogged.tokens.refresh_token);
        });
    });

    describe('Token refresh', () => {
        test('returns a new access_token and a new refresh_token', async () => {
            const userLogged = await sut.givenALoggedUser();

            const tokens = (await new AuthUserUseCase(userRepository).refreshToken(userLogged.user.email)) as JwtToken;
            expect(tokens.access_token).not.toBeNull();
            expect(tokens.refresh_token).not.toBeNull();

            const user = await userRepository.getByEmail(userLogged.user.email);
            expect(user.refresh_token).toEqual(userLogged.tokens.refresh_token);
        });
    });

    describe('Check refresh token', () => {
        test('return true if the refresh_token used is the same as that recorded in bdd', async () => {
            const userLogged = await sut.givenALoggedUser();
            const res = await new AuthUserUseCase(userRepository).checkValidityRefreshToken(
                userLogged.user.email,
                userLogged.tokens.refresh_token,
            );
            expect(res).toBe(true);
        });

        test('return false if refresh_token used is not the same as that recorded in bdd', async () => {
            const userLogged = await sut.givenALoggedUser();
            const res = await new AuthUserUseCase(userRepository).checkValidityRefreshToken(
                userLogged.user.email,
                'invalid_token',
            );
            expect(res).toBe(false);
        });
    });

    describe('Delete refresh token', () => {
        test('return void and throw no error if refresh token is delete for this user', async () => {
            // This try catch allows to check if an error is throw
            try {
                const userLogged = await sut.givenALoggedUser();
                await new AuthUserUseCase(userRepository).revokeRefreshToken(userLogged.user.email);
                expect(true).toBe(true);
            } catch (err) {
                //This expect breaks the test because it must not throw an error
                expect(true).toBe(false);
            }
        });

        test('throw error if user does not exist', async () => {
            try {
                await sut.givenALoggedUser();
                await new AuthUserUseCase(userRepository).revokeRefreshToken(faker.internet.email());
                //This expect breaks the test because it must throw an error
                expect(true).toBe(false);
            } catch (err) {
                expect(true).toBe(true);
            }
        });
    });

    describe('Verify tokens', () => {
        test('return the user if the access token is ok', async () => {
            const expectedUser = await sut.givenALoggedUser();
            const user = new AuthUserUseCase(userRepository).verifyAccessToken(expectedUser.tokens.access_token);
            expect(user.id).toEqual(expectedUser.user.id);
        });

        test('return undefined if the access token is not ok', async () => {
            try {
                await sut.givenALoggedUser();
                new AuthUserUseCase(userRepository).verifyAccessToken(sut.getFakeAccessToken());
                expect(true).toBe(false);
            } catch (err) {
                expect(true).toEqual(true);
            }
        });

        test('return the email if the refresh token is ok', async () => {
            const expectedUser = await sut.givenALoggedUser();
            const email = await new AuthUserUseCase(userRepository).verifyRefreshToken(
                expectedUser.tokens.refresh_token,
            );
            expect(email).toEqual(expectedUser.user.email);
        });

        test('return undefined if the access token is not ok', async () => {
            try {
                await sut.givenALoggedUser();
                await new AuthUserUseCase(userRepository).verifyRefreshToken(sut.getFakeRefreshToken());
                expect(true).toBe(false);
            } catch (err) {
                expect(true).toEqual(true);
            }
        });
    });

    describe('Reconnect the user', () => {
        test('reconnect and return the user if the access token is ok, new tokens are created', async () => {
            const expectedUser = await sut.givenALoggedUser();
            const user = await new AuthUserUseCase(userRepository).tryReconnect(expectedUser.tokens);
            expect(user.user.id).toEqual(expectedUser.user.id);
        });

        test('reconnect and return the user if the access token is not valid and the refresh token is ok, new tokens are created', async () => {
            const expectedUser = await sut.givenALoggedUserWithBadAccessToken();
            const user = await new AuthUserUseCase(userRepository).tryReconnect(expectedUser.tokens);
            expect(user.user.id).toEqual(expectedUser.user.id);
        });

        test('throw an error if both access_token and refresh_token are invalid', async () => {
            try {
                const expectedUser = await sut.givenALoggedUserWithBadTokens();
                await new AuthUserUseCase(userRepository).tryReconnect(expectedUser.tokens);
                expect(true).toBe(false);
            } catch (err) {
                expect(true).toEqual(true);
            }
        });
    });
});

class SUT {
    private _userTestBuilder: UserTestBuilder;
    constructor(private readonly _userRepositoryInMemory: UserRepositoryInMemory) {
        this._userTestBuilder = new UserTestBuilder();
    }

    givenAnInputLoginUser(): InputLoginUser {
        return this._userTestBuilder.buildInputLoginUser();
    }
    givenAUser(): User {
        const user = this._userTestBuilder.buildUserWithPassword();
        this._userRepositoryInMemory.setUser(user);
        return user;
    }

    givenAUserWithNotExistEmail(): User {
        this._userTestBuilder.withEmail('notexist@email.com');
        const user = this._userTestBuilder.buildUser();
        this._userRepositoryInMemory.setUser(user);
        return user;
    }

    givenAUserWithBadPassword(): User {
        this._userTestBuilder.withHashPassword('notthegood');
        const user = this._userTestBuilder.buildUserWithPassword();
        this._userRepositoryInMemory.setUser(user);
        return user;
    }

    async givenALoggedUser(): Promise<UserLogged> {
        const inputLoginUser = this.givenAnInputLoginUser();
        this.givenAUser();
        return (await new AuthUserUseCase(this._userRepositoryInMemory).login(inputLoginUser)) as UserLogged;
    }

    async givenALoggedUserWithBadAccessToken(): Promise<UserLogged> {
        const inputLoginUser = this.givenAnInputLoginUser();
        this.givenAUser();
        const userLogged = (await new AuthUserUseCase(this._userRepositoryInMemory).login(
            inputLoginUser,
        )) as UserLogged;
        userLogged.tokens.access_token = this.getFakeAccessToken();
        return userLogged;
    }

    async givenALoggedUserWithBadTokens(): Promise<UserLogged> {
        const inputLoginUser = this.givenAnInputLoginUser();
        this.givenAUser();
        const userLogged = (await new AuthUserUseCase(this._userRepositoryInMemory).login(
            inputLoginUser,
        )) as UserLogged;
        userLogged.tokens.access_token = this.getFakeAccessToken();
        userLogged.tokens.refresh_token = this.getFakeRefreshToken();
        return userLogged;
    }

    getFakeAccessToken(): string {
        return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo2LCJlbWFpbCI6InRlc3QxQHRlc3QuY29tIiwidXNlcm5hbWUiOiJ1c2VybmFtZXRlc3QiLCJyb2xlcyI6bnVsbCwiY3JlYXRlZF9hdCI6IjIwMjMtMTAtMTJUMTU6Mjk6MjYuMzcwWiIsInVwZGF0ZWRfYXQiOm51bGx9LCJpYXQiOjE2OTcxNDE1MzEsImV4cCI6MTY5NzE0MTU0MX0.34Iy0VivtR6VjQpLuiOGLrT2R0adXNfRbKW0dpEz3w4`;
    }

    getFakeRefreshToken(): string {
        return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidGVzdDFAdGVzdC5jb20iLCJpYXQiOjE2OTcxNDE1MzEsImV4cCI6MTY5NzE0MTU0MX0.VL1pzoZM9MmBEE_uWn2NKABx5AkztoaHr768zUgZBdY`;
    }
}
