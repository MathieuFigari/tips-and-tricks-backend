import InputRegisterUser from '../models/inputRegisterUser';
import User from '../models/User';
import UserRepositoryInterface from '../ports/userRepositoryInterface';
import bcrypt from 'bcrypt';
import debug from 'debug';
import * as dotenv from 'dotenv';
import InputError, {
    EmailAlreadyExistInputError,
    UsernameAlreadyExistInputError,
} from '../../../_common/domain/errors/inputError';
dotenv.config();
const logger = debug('tipsandtricks:registerUserUseCase');

export interface RegisterUserUseCaseInterface {
    register(input: InputRegisterUser): Promise<User | InputError>;
}

export default class RegisterUserUseCase implements RegisterUserUseCaseInterface {
    constructor(private readonly _userRepository: UserRepositoryInterface) {}

    async register(input: InputRegisterUser): Promise<User | InputError> {
        if (!this.inputRegisterValidateFormat(input)) {
            logger('format invalid');
            throw new InputError('Register failed !');
        }

        const isEmailExist = await this._checkUnicityEmail(input.email);
        if (isEmailExist) {
            throw new EmailAlreadyExistInputError('This email already exists in database !');
        }

        const isUsernameExist = await this._checkUnicityUsername(input.username);
        if (isUsernameExist) {
            throw new UsernameAlreadyExistInputError('This username already exists in database !');
        }

        input.password = bcrypt.hashSync(input.password, parseInt(process.env.ROUND_SALT_PWD));

        const userJustCreated = await this._userRepository.create(input);
        if (!userJustCreated) {
            logger('bdd error');
            throw new InputError('Register failed !');
        }

        return userJustCreated;
    }

    private inputRegisterValidateFormat(inputUserData: InputRegisterUser): boolean {
        const isValid: boolean[] = [];

        for (const [inputKey, value] of Object.entries(inputUserData)) {
            switch (inputKey) {
                case 'email':
                    isValid.push(this._checkEmailFormat(value));
                    break;
                case 'username':
                    isValid.push(this._checkLengthUsername(value));
                    break;
                case 'password':
                    isValid.push(this._checkStrengthPassword(value));
                    break;
            }
        }

        return isValid.every((item) => item);
    }

    private _checkEmailFormat(password: string): boolean {
        const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
        return emailRegex.test(password);
    }

    private _checkStrengthPassword(password: string): boolean {
        const passwordRegex = /^(?=(?:.*\d))(?=(?:.*[a-zA-Z]))(?=(?:.*[A-Z])).{12,}$/;
        return passwordRegex.test(password);
    }

    private _checkLengthUsername(username: string): boolean {
        return !(username.length < 2);
    }

    private async _checkUnicityEmail(email: string): Promise<boolean> {
        const existingUser = await this._userRepository.getByEmail(email);
        return !!existingUser;
    }

    private async _checkUnicityUsername(username: string): Promise<boolean> {
        const existingUser = await this._userRepository.getByUsername(username);
        return !!existingUser;
    }
}
