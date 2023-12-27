import InputError from '../../../_common/domain/errors/inputError';
import User, { JwtToken, UserLogged } from '../models/User';
import InputLoginUser from '../models/inputLoginUser';
import UserRepositoryInterface from '../ports/userRepositoryInterface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import debug from 'debug';
import UserFactory from '../factories/userFactory';
import AuthError from '../../../_common/domain/errors/authError';
import { JwtPayload } from 'jsonwebtoken';
const logger = debug('tipsandtricks:authUserUseCase');

export interface AuthUserUseCaseInterface {
    login(input: InputLoginUser): Promise<UserLogged | InputError>;
}

export type CookieOptions = {
    httpOnly: boolean;
    sameSite: boolean | 'lax' | 'strict' | 'none';
    secure: boolean;
    expires: Date;
    path?: string;
};

export default class AuthUserUseCase implements AuthUserUseCaseInterface {
    constructor(private readonly _userRepository: UserRepositoryInterface) {}

    async login(input: InputLoginUser): Promise<UserLogged | InputError> {
        const user = (await this._userRepository.getByEmail(input.email)) as User & { password: string };
        if (!user) {
            logger('bad email');
            throw new InputError('Login errors !');
        }

        const isSamePassword = bcrypt.compareSync(input.password, user.password);
        if (!isSamePassword) {
            logger('bad password');
            throw new InputError('Login errors !');
        }

        const userToSend = UserFactory.createWithoutPassword(user);
        const jwtTokens = await this._generateTokens(userToSend);

        return new UserLogged(userToSend, jwtTokens);
    }

    verifyAccessToken(token: string): User {
        let user: User = null;
        jwt.verify(token, process.env.JWT_SECRET_ACCESS || 'access_secret', (err, decoded: JwtPayload) => {
            if (err) {
                return null;
            }
            user = decoded.data as User;
        });
        return user;
    }

    async verifyRefreshToken(token: string): Promise<string> {
        let email: string = null;
        jwt.verify(token, process.env.JWT_SECRET_REFRESH || 'refresh_secret', (err, decoded: JwtPayload) => {
            if (err) {
                throw new AuthError('token not valid');
            }
            email = decoded.data;
        });

        const isValid = await this.checkValidityRefreshToken(email, token);
        if (!isValid) {
            throw new AuthError('Invalid refresh_token');
        }
        return email;
    }

    async refreshToken(email: string): Promise<JwtToken> {
        const user = await this._userRepository.getByEmail(email);
        if (!user) {
            logger('user does not exist');
            throw new InputError('Refresh token errors !');
        }

        const userToSend = UserFactory.createWithoutPassword(user);
        return await this._generateTokens(userToSend);
    }

    async checkValidityRefreshToken(email: string, refreshToken: string): Promise<boolean> {
        const user = await this._userRepository.getByEmail(email);
        return user.refresh_token === refreshToken;
    }

    async revokeRefreshToken(email: string): Promise<void> {
        const res = await this._userRepository.revokeToken(email);
        if (!res) throw new AuthError('Authentification error');
    }

    async tryReconnect(jwtTokens: JwtToken): Promise<UserLogged | null> {
        try {
            const user = this.verifyAccessToken(jwtTokens.access_token);
            if (user) {
                jwtTokens = await this.refreshToken(user.email);
                return new UserLogged(user, jwtTokens);
            }

            const email = await this.verifyRefreshToken(jwtTokens.refresh_token);
            if (email) {
                const userInDb = await this._userRepository.getByEmail(email);
                if (!userInDb) return null;

                jwtTokens = await this.refreshToken(email);
                return new UserLogged(UserFactory.createWithoutPassword(userInDb), jwtTokens);
            }
        } catch (err) {
            return null;
        }
    }

    generateCookies(route: string | null = null): CookieOptions {
        const today = new Date();
        let cookieOptions = {
            httpOnly: true,
            sameSite: true,
            secure: process.env.ENVIRONNMENT === 'production',
            expires: new Date(today.setMonth(today.getMonth() + 1)),
        } as CookieOptions;

        if (route) cookieOptions = { ...cookieOptions, path: route };

        return cookieOptions;
    }

    private async _generateTokens(user: User): Promise<JwtToken> {
        const accessToken: string = jwt.sign(
            {
                data: user,
            },
            process.env.JWT_SECRET_ACCESS,
            {
                expiresIn: +process.env.JWT_ACCESS_EXPIRATION || 300,
            },
        );

        const refreshToken: string = jwt.sign(
            {
                data: user.email,
            },
            process.env.JWT_SECRET_REFRESH,
            {
                expiresIn: +process.env.JWT_REFRESH_EXPIRATION || 86400,
            },
        );
        const isStored = await this._userRepository.setRefreshToken(user.id, refreshToken);
        if (!isStored) throw new AuthError('Auth error !');

        return new JwtToken(accessToken, refreshToken);
    }
}
