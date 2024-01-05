import User from '../models/User';
import UserRepositoryInterface from '../ports/userRepositoryInterface';
import NotFoundError from '../../../_common/domain/errors/notFoundError';
import * as dotenv from 'dotenv';
dotenv.config();

export interface GetUserInformationsUseCaseInterface {
    getUser(userId: number): Promise<User>;
}

export default class GetUserInformationsUseCase implements GetUserInformationsUseCaseInterface {
    constructor(private readonly _userRepository: UserRepositoryInterface) {}

    async getUser(userId: number): Promise<User> {
        const user = await this._userRepository.getUser(userId);

        if (!user) throw new NotFoundError('User not found');

        return user;
    }
}
