import UserRepositoryInMemory from '../../../server-side/repositories/userRepositoryInMemory';
import UserTestBuilder from './UserTestBuilder';
import InputLoginUser from '../../models/inputLoginUser';
import AuthUserUseCase from '../authUserUseCase';
import User, { UserLogged } from '../../models/User';
import GetUserInformationsUseCase from '../getUserInformationsUseCase';

describe('get user informations', () => {
    let userRepository: UserRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        userRepository = new UserRepositoryInMemory();
        sut = new SUT(userRepository);
    });

    test('can fetch user personal information', async () => {
        const userLogged = await sut.givenALoggedUser();
        const userInfo = await new GetUserInformationsUseCase(userRepository).getUser(userLogged.user.id);
        expect(userInfo).toEqual(userLogged.user);
    });

    test('throws an error if user information cannot be fetched', async () => {
        const nonExistingUserId = 999;
        const getUserInfoUseCase = new GetUserInformationsUseCase(userRepository);

        await expect(getUserInfoUseCase.getUser(nonExistingUserId)).rejects.toThrow('User not found');
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

    async givenALoggedUser(): Promise<UserLogged> {
        const inputLoginUser = this.givenAnInputLoginUser();
        this.givenAUser();
        return (await new AuthUserUseCase(this._userRepositoryInMemory).login(inputLoginUser)) as UserLogged;
    }
}
