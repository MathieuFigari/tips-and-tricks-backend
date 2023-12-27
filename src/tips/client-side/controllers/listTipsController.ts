import ListTipsUseCase from '../../domain/use_cases/listTipsUseCase';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import { NextFunction, Response } from 'express';
import PaginatedInput from '../../../_common/domain/models/paginatedInput';
import PaginatedResponse from '../../../_common/domain/models/paginatedResponse';
import Tips from '../../domain/models/Tips';

export default class ListTipsController {
    constructor(private readonly _listTipsUseCase: ListTipsUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Tips
     * /tips:
     *   get:
     *     summary: Retrieve tips list
     *     parameters:
     *      - in: query
     *        name: page
     *        schema:
     *           type: integer
     *        description: The page for which tips are retrieved.
     *      - in: query
     *        name: length
     *        schema:
     *           type: integer
     *        description: Determines the number of tips to recover.
     *     tags: [Tips]
     *     responses:
     *       200:
     *         description: Tips recovered.
     *         content:
     *          application/json:
     *              schema:
     *                  $ref: '#/components/schemas/Tips'
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Some server errors
     *
     */
    public async tipsList(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const paginatedInput = new PaginatedInput(
                req.query.page ? +req.query.page : 1,
                req.query.length ? +req.query.length : 14,
            );

            const paginatedResponse: PaginatedResponse<Tips> = await this._listTipsUseCase.getList(
                +req.user.id,
                paginatedInput,
            );

            return res.status(200).send(paginatedResponse);
        } catch (err) {
            next(err);
        }
    }
}
