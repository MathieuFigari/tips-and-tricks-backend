import { NextFunction, Response } from 'express';
import InputLoginUser from '../../domain/models/inputLoginUser';
import AuthUserUseCase from '../../domain/use_cases/authUserUseCase';
import { JwtToken, UserLogged } from '../../domain/models/User';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import * as dotenv from 'dotenv';
import AuthError from '../../../_common/domain/errors/authError';
dotenv.config();

export default class AuthController {
    constructor(private readonly _authUserUseCase: AuthUserUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: User
     *   description: Login a user
     * /login:
     *   post:
     *     summary: Login a user
     *     tags: [User]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/InputLoginUser'
     *     responses:
     *       200:
     *         description: the logged user and .
     *         headers:
     *             Set-Cookie:
     *               schema:
     *                 type: string
     *                 example:
     *                   ACCESS_TOKEN=abcde12345; Path=/; HttpOnly;
     *                   REFRESH_TOKEN=abcde12345; Path=/; HttpOnly;
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Some server errors
     *
     */
    public async login(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const inputLoginUser = new InputLoginUser(req.body.email, req.body.password);
            const data = (await this._authUserUseCase.login(inputLoginUser)) as UserLogged;

            res.cookie('ACCESS_TOKEN', data.tokens.access_token, { ...this._authUserUseCase.generateCookies() })
                .cookie('REFRESH_TOKEN', data.tokens.refresh_token, {
                    ...this._authUserUseCase.generateCookies('/api/refresh-token'),
                })
                .cookie('REFRESH_TOKEN', data.tokens.refresh_token, {
                    ...this._authUserUseCase.generateCookies('/api/reconnect'),
                });

            return res.status(200).send({
                data: data.user,
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * @openapi
     * tags:
     *   name: User
     *   description: Refresh user tokens
     * /refresh-token:
     *   get:
     *     summary: Refresh tokens
     *     tags: [User]
     *     security:
     *         - cookieAuth: [
     *             REFRESH_TOKEN=abcde12345; Path=/; HttpOnly;
     *         ]
     *
     *     responses:
     *       200:
     *         description: the logged user and .
     *         headers:
     *             Set-Cookie:
     *               schema:
     *                 type: string
     *                 example:
     *                   ACCESS_TOKEN=abcde12345; Path=/; HttpOnly;
     *                   REFRESH_TOKEN=abcde12345; Path=/; HttpOnly;
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Some server errors
     *
     */
    public async refreshToken(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const tokens: JwtToken = await this._authUserUseCase.refreshToken(req.email);

            res.cookie('ACCESS_TOKEN', tokens.access_token, { ...this._authUserUseCase.generateCookies() })
                .cookie('REFRESH_TOKEN', tokens.refresh_token, {
                    ...this._authUserUseCase.generateCookies('/api/refresh-token'),
                })
                .cookie('REFRESH_TOKEN', tokens.refresh_token, {
                    ...this._authUserUseCase.generateCookies('/api/reconnect'),
                });

            return res.status(200).send({
                data: 'Tokens regenerate with success',
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * @openapi
     * tags:
     *   name: User
     *   description: Logout
     * /logout:
     *   post:
     *     summary: Logout a user
     *     tags: [User]
     *     responses:
     *       200:
     *         description: logout success - delete cookie ACCESS_TOKEN
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Some server errors
     *
     */
    public async logout(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            await this._authUserUseCase.revokeRefreshToken(req.user.email);
            res.clearCookie('ACCESS_TOKEN');
            res.end();
        } catch (err) {
            next(err);
        }
    }

    /**
     * @openapi
     * tags:
     *   name: User
     *   description: Reconnect a user
     * /reconnect:
     *   post:
     *     summary: Reconnect a user
     *     tags: [User]
     *     security:
     *         - cookieAuth: [
     *             ACCESS_TOKEN=abcde12345; Path=/; HttpOnly;
     *         ]
     *     responses:
     *       200:
     *         description: reconnect success
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Some server error
     *
     */
    public async reconnect(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const jwtTokens = new JwtToken(req.cookies['ACCESS_TOKEN'] || null, req.cookies['REFRESH_TOKEN'] || null);

            const userLogged = await this._authUserUseCase.tryReconnect(jwtTokens);
            if (userLogged) {
                res.cookie('ACCESS_TOKEN', userLogged.tokens.access_token, {
                    ...this._authUserUseCase.generateCookies(),
                })
                    .cookie('REFRESH_TOKEN', userLogged.tokens.refresh_token, {
                        ...this._authUserUseCase.generateCookies('/api/refresh-token'),
                    })
                    .cookie('REFRESH_TOKEN', userLogged.tokens.refresh_token, {
                        ...this._authUserUseCase.generateCookies('/api/reconnect'),
                    });

                return res.status(200).send({
                    data: userLogged.user,
                });
            }

            res.status(200).send({
                data: null,
            });
            next();
        } catch (err) {
            throw new AuthError('Authentification error');
        }
    }
}
