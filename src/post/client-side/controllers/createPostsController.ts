import { NextFunction, Response } from 'express';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import CreatePostUseCase from '../../domain/use_cases/createPostsUseCase';
import InputCreatePost from '../../domain/model/inputCreatePost';

export default class createPostController {
    constructor(private readonly _createPostUseCase: CreatePostUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Post
     *   description: Register a post
     * /post:
     *   post:
     *     summary: Create a new post
     *     tags: [Post]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/InputCreatePost'
     *     responses:
     *       201:
     *         description: The created post.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/InputCreatePost'
     *       400:
     *          description: Bad request
     *       500:
     *         description: Some server errors
     *
     */
    public async create(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const message: string = req.body.message === '' ? null : req.body.message;
            const description: string = req.body.description === '' ? null : req.body.description;
            const inputCreatePost = new InputCreatePost(
                req.body.title,
                message,
                description,
                req.body.command,
                req.user.id,
            );
            const data = await this._createPostUseCase.create(inputCreatePost);
            return res.status(201).send(data);
        } catch (err) {
            next(err);
        }
    }
}
