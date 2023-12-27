import { NextFunction, Response } from 'express';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import UpdateTipsUseCase from '../../domain/use_cases/updateTipsUseCase';
import InputUpdateTips from '../../domain/models/InputUpdateTips';
import ParamError from '../../../_common/domain/errors/paramError';
import debug from 'debug';
const logger = debug('tipsandtricks:registerUserUseCase');

export default class updateTipsController {
    constructor(private readonly _updateTipsUseCase: UpdateTipsUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Tips
     * /tips/{tipsId}:
     *   put:
     *     summary: Update an existing tip
     *     tags: [Tips]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/InputUpdateTips'
     *     responses:
     *       201:
     *         description: The updated tips.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Tips'
     *       400:
     *          description: Bad request
     *       401:
     *          description: Unauthorized
     *       500:
     *         description: Some server errors
     *
     */
    public async update(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const tipsId: number | null = req.params.tipsId ? +req.params.tipsId : null;
            const description: string | null = req.body.description === '' ? null : req.body.description;

            if (!tipsId) {
                logger('tipsId invalid');
                throw new ParamError('Updated tips failed !');
            }

            const inputUpdateTips = new InputUpdateTips(
                tipsId,
                req.body.title,
                req.body.command,
                description,
                req.user.id,
            );

            const data = await this._updateTipsUseCase.update(inputUpdateTips);
            return res.status(200).send({
                data: data,
            });
        } catch (err) {
            next(err);
        }
    }
}
