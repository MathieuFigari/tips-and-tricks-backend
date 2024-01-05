import { NextFunction, Response } from 'express';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import CreateCommentUseCase from '../../../comment/domain/use_cases/createCommentUseCase';
import InputCreateComment from '../../../comment/domain/model/inputCreateComment';

export default class createCommentController {
    constructor(private readonly _createCommentUseCase: CreateCommentUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Comment
     *   description: Register a comment
     * /comment:
     *   post:
     *     summary: Create a new comment
     *     tags: [Comment]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/InputCreateComment'
     *     responses:
     *       201:
     *         description: The created comment.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/InputCreateComment'
     *       400:
     *          description: Bad request
     *       500:
     *         description: Some server errors
     *
     */
    public async create(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const userName = req.user.username;
            const inputCreateComment = new InputCreateComment(req.body.content, req.user.id, +req.params.postId);
            const data = await this._createCommentUseCase.create(inputCreateComment, userName);
            return res.status(201).send(data);
        } catch (err) {
            next(err);
        }
    }
}
