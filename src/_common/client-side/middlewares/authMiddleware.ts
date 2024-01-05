import * as dotenv from 'dotenv';
import { Response, NextFunction } from 'express';
import pkg from 'lodash';
import { RequestLogged } from '../types/requestLogged';
import AuthError from '../../domain/errors/authError';
import dependencyContainer from '../../../_dependencyContainer/dependencyContainer';
import AuthUserUseCase from '../../../user/domain/use_cases/authUserUseCase';
const { isEmpty } = pkg;
dotenv.config();

export default class AuthMiddleware {
    authorize(tokenName: string): (request: RequestLogged, response: Response, next: NextFunction) => void {
        return async (request: RequestLogged, _: Response, next: NextFunction) => {
            try {
                const authCookies = request.cookies;
                if (isEmpty(authCookies)) tokenName = null;

                switch (tokenName) {
                    case 'ACCESS_TOKEN': {
                        request.user = dependencyContainer
                            .get<AuthUserUseCase>('AuthUserUseCase')
                            .verifyAccessToken(authCookies['ACCESS_TOKEN']);

                        if (!request.user) throw new AuthError('Access token not valid !');
                        return next();
                    }
                    case 'REFRESH_TOKEN': {
                        request.email = await dependencyContainer
                            .get<AuthUserUseCase>('AuthUserUseCase')
                            .verifyRefreshToken(authCookies['REFRESH_TOKEN']);
                        return next();
                    }
                    default: {
                        throw new AuthError('Unauthorized');
                    }
                }
            } catch (err) {
                next(err);
            }
        };
    }
}
