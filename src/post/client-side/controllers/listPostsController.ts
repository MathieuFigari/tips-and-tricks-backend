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
     *       - in: query
     *         name: start
     *         schema:
     *           type: integer
     *         description: The point which is use for start posts list.
     *       - in: query
     *         name: length
     *         schema:
     *           type: integer
     *         description: Determines the number of posts to recover.
     *       - in: query
     *         name: tagId
     *         schema:
     *           type: integer
     *         description: The optional filter by Tags.
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: The optional search by title, description or message.
     *     responses:
     *       200:
     *         description: Post recovered.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Post'
     *       500:
     *         description: Some server errors
     */
    public async postsList(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const infiniteInput = new InfiniteInput(
                req.query.start ? +req.query.start : 0,
                req.query.length ? +req.query.length : 20,
            );

            const search = typeof req.query.search === 'string' ? req.query.search : undefined;

            const tagId = req.query.tagId ? Number(req.query.tagId) : undefined;

            const infiniteResponse: InfiniteResponse<Post> = await this._listPostsUseCase.getList(
                infiniteInput,
                tagId,
                search,
            );
            return res.status(200).send(infiniteResponse);
        } catch (err) {
            next(err);
        }
    }
}
