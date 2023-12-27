import { NextFunction, Response } from 'express';
import CreateTipsUseCase from '../../domain/use_cases/createTipsUseCase';
import InputCreateTips from '../../domain/models/inputCreateTips';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';

export default class createTipsController {
    constructor(private readonly _createTipsUseCase: CreateTipsUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Tips
     * /tips:
     *   post:
     *     summary: Create a new tips
     *     tags: [Tips]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/InputCreateTips'
     *     responses:
     *       201:
     *         description: The created tips.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Tips'
     *       400:
     *          description: Bad request
     *       500:
     *         description: Some server errors
     *
     */
    public async create(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const description: string = req.body.description === '' ? null : req.body.description;
            const inputTips = new InputCreateTips(req.body.title, req.body.command, description, req.user.id);
            const data = await this._createTipsUseCase.create(inputTips);
            return res.status(201).send({
                data: data,
            });
        } catch (err) {
            next(err);
        }
    }
}
