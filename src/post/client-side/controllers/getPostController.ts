import GetPostUseCase from '../../domain/use_cases/getPostUseCase';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import { NextFunction, Response } from 'express';
import Post from '../../domain/model/post';

export default class GetPostController {
    constructor(private readonly _getPostUseCase: GetPostUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Post
     * /post/{postId}:
     *   get:
     *     summary: Retrieve one post
     *     parameters:
     *      - in: query
     *        name: postId
     *        schema:
     *           type: integer
     *        description: The id of the post to retrieve
     *     tags: [Post]
     *     responses:
     *       201:
     *         description: Post recovered.
     *         content:
     *          application/json:
     *              schema:
     *                  $ref: '#/components/schemas/Post'
     *       500:
     *         description: Some server errors
     *
     */
    public async getPost(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const postId = +req.params.postId;
            const post: Post | null = await this._getPostUseCase.getPost(postId);
            return res.status(200).send(post);
        } catch (err) {
            next(err);
        }
    }
}
