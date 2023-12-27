import ListPostUseCase from '../../domain/use_cases/listPostsUseCase';
import InfiniteInput from '../../../_common/domain/models/infiniteInput';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import { NextFunction, Response } from 'express';
import InfiniteResponse from '../../../_common/domain/models/infiniteResponse';
import Post from '../../domain/model/post';

export default class ListPostsController {
    constructor(private readonly _listPostsUseCase: ListPostUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Post
     * /posts:
     *   get:
     *     summary: Retrieve posts list
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
     *     tags: [Post]
     *     responses:
     *       200:
     *         description: Post recovered.
     *         content:
     *          application/json:
     *              schema:
     *                  $ref: '#/components/schemas/Post'
     *       500:
     *         description: Some server errors
     *
     */
    public async postsList(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const infiniteInput = new InfiniteInput(
                req.query.start ? +req.query.start : 0,
                req.query.length ? +req.query.length : 20,
            );

            const infiniteResponse: InfiniteResponse<Post> = await this._listPostsUseCase.getList(infiniteInput);

            return res.status(200).send(infiniteResponse);
        } catch (err) {
            next(err);
        }
    }
}
