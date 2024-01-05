import ListTagUseCase from '../../domain/use_cases/listTagsUseCase';
import Tag from '../../domain/model/tag';
import { Request, Response, NextFunction } from 'express';

export default class ListTagsController {
    constructor(private readonly _listTagsUseCase: ListTagUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Tag
     * /tags:
     *   get:
     *     summary: Retrieve tags list
     *     tags: [Tag]
     *     responses:
     *       200:
     *         description: Tags list retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Tag'
     *       500:
     *         description: Some server errors
     *
     */
    public async tagsList(_req: Request, res: Response, next: NextFunction) {
        try {
            const tags: Tag[] = await this._listTagsUseCase.getList();

            return res.status(200).json({ data: tags });
        } catch (err) {
            next(err);
        }
    }
}
