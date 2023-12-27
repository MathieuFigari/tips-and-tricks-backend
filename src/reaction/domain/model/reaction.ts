/**
 * @swagger
 * components:
 *   schemas:
 *     ReactionType:
 *       type: string
 *       enum :
 *         - like
 *         - dislike
 */
export enum ReactionType {
    like = 'like',
    dislike = 'dislike',
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Reaction:
 *       type: object
 *       required:
 *         - post_id
 *         - user_id
 *         - reaction
 *       properties:
 *         post_id:
 *           type: number
 *         user_id:
 *           type: number
 *         reaction:
 *           $ref: '#/components/schemas/ReactionType'
 *       example:
 *         reaction:
 *         likes: 10
 *         dislikes: 10
 */
export default class Reaction {
    constructor(
        public readonly post_id: number,
        public readonly user_id: number,
        public readonly reaction: ReactionType | null,
    ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserReactionWithLikesDislikes:
 *       type: object
 *       required:
 *         - reaction
 *         - likes
 *         - dislikes
 *       properties:
 *         reaction:
 *           $ref: '#/components/schemas/Reaction'
 *         likes:
 *           type: number
 *         dislikes:
 *           type: number
 *       example:
 *         reaction:
 *         likes: 10
 *         dislikes: 10
 */
export type UserReactionWithLikesDislikes = {
    reaction: Reaction | null;
    likes: number;
    dislikes: number;
};
