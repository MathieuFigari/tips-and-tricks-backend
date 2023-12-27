import { ReactionOnPostUseCaseInterface } from '../../domain/uses_case/reactionOnPostUseCase';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import { Response, NextFunction } from 'express';
import InputReaction from '../../domain/model/inputReaction';

export default class ReactionController {
    constructor(private readonly _reactionOnPostUseCase: ReactionOnPostUseCaseInterface) {}

    /**
     * @openapi
     * tags:
     *   name: Reaction
     * /reaction/post/{postId}:
     *   post:
     *     summary: Interaction with a post (like, dislike)
     *     tags: [Reaction]
     *     parameters:
     *      - in: path
     *        name: postId
     *        schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ReactionBody'
     *     responses:
     *       201:
     *         description: add reaction.
     *         content:
     *          application/json:
     *              schema:
     *                  $ref: '#/components/schemas/Reaction'
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Some server errors
     *
     * @swagger
     * components:
     *   schemas:
     *     ReactionBody:
     *       type: object
     *       required:
     *         - reaction
     *       properties:
     *         reaction:
     *           $ref: '#/components/schemas/ReactionType'
     *       example:
     *         reaction: 'like'
     */
    public async reactionOnPost(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const inputReaction: InputReaction = new InputReaction(
                parseInt(req.params.postId) || null,
                req.user.id || null,
                req.body.reaction ? req.body.reaction : null,
            );

            const response = await this._reactionOnPostUseCase.reactionOnPost(inputReaction);

            if (response === null) return res.status(204).send();
            return res.status(201).send(response);
        } catch (err) {
            next(err);
        }
    }

    /**
     * @openapi
     * tags:
     *   name: Reaction
     * /reaction/post/{postId}:
     *   get:
     *     summary: Retrieve interactions with a post (like, dislike) for a user logged
     *     tags: [Reaction]
     *     parameters:
     *      - in: path
     *        name: postId
     *        schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: get reaction for a post.
     *         content:
     *          application/json:
     *              schema:
     *                  $ref: '#/components/schemas/UserReactionWithLikesDislikes'
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Some server errors
     */
    public async getReactionForCurrentUser(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const postId = parseInt(req.params.postId);

            const response = await this._reactionOnPostUseCase.getReactionForCurrentUser(userId, postId);

            if (response === null) return res.status(204).send();
            return res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    }
}
