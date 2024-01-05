import ListCommentsUseCase from '../../../comment/domain/use_cases/listCommentsUseCase';
import InfiniteInput from '../../../_common/domain/models/infiniteInput';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import { NextFunction, Response } from 'express';
import InfiniteResponse from '../../../_common/domain/models/infiniteResponse';
import Comment from '../../../comment/domain/model/comment';

export default class ListCommentsController {
    constructor(private readonly _listCommentsUseCase: ListCommentsUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Comment
     * /comments:
     *   get:
     *     summary: Retrieve comments list
     *     parameters:
     *      - in: query
     *        name: start
     *        schema:
     *           type: integer
     *        description: The point which is use for start posts list.
     *      - in: query
     *        name: length
     *        schema:
     *           type: integer
     *        description: Determines the number of posts to recover.
     *     tags: [Comment]
     *     responses:
     *       200:
     *         description: Post recovered.
     *         content:
     *          application/json:
     *              schema:
     *                  $ref: '#/components/schemas/Comment'
     *       500:
     *         description: Some server errors
     *
     */
    public async commentsList(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const infiniteInput = new InfiniteInput(
                req.query.start ? +req.query.start : 0,
                req.query.length ? +req.query.length : 20,
            );

            const postId = +req.params.postId;

            const infiniteResponse: InfiniteResponse<Comment> = await this._listCommentsUseCase.getList(
                infiniteInput,
                postId,
            );

            return res.status(200).send(infiniteResponse);
        } catch (err) {
            next(err);
        }
    }
}
