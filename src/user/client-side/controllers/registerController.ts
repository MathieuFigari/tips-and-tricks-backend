import { NextFunction, Response } from 'express';
import RegisterUserUseCase from '../../domain/use_cases/registerUserUseCase';
import InputRegisterUser from '../../domain/models/inputRegisterUser';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';

export default class RegisterController {
    constructor(private readonly _registerUserUseCase: RegisterUserUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: User
     *   description: Register a user
     * /register:
     *   post:
     *     summary: Create a new user
     *     tags: [User]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/InputRegisterUser'
     *     responses:
     *       201:
     *         description: The created user.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *          description: Bad request
     *       500:
     *         description: Some server errors
     *
     */
    public async register(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const inputRegisterUser = new InputRegisterUser(req.body.email, req.body.username, req.body.password);
            const data = await this._registerUserUseCase.register(inputRegisterUser);
            return res.status(201).send({
                data: data,
            });
        } catch (err) {
            next(err);
        }
    }
}
