import GetUserInformationsUseCase from 'src/user/domain/use_cases/getUserInformationsUseCase';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import { NextFunction, Response } from 'express';
import User from 'src/user/domain/models/User';

export default class GetUserInfosController {
    constructor(private readonly _getUserInformationsUseCase: GetUserInformationsUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: User
     *      /me
     *   get:
     *     summary: Retrieve one post
     *     tags: [User]
     *     responses:
     *       200:
     *         description: User Recovered.
     *         content:
     *          application/json:
     *              schema:
     *                  $ref: '#/components/schemas/User'
     *       500:
     *         description: Some server errors
     *
     */
    public async getUser(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const user: User | null = await this._getUserInformationsUseCase.getUser(userId);
            return res.status(200).send(user);
        } catch (err) {
            next(err);
        }
    }
}
