/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - id
 *         - user_id
 *         - post_id
 *         - content
 *         - published_at
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: number
 *         user_id:
 *           type: number
 *         post_id:
 *           type: number
 *         content:
 *         published_at:
 *           type: string
 *           format: date
 *         created_at:
 *           type: string
 *           format: date
 *         updated_at:
 *           type: string
 *           format: date
 *       example:
 *         id: 4
 *         user_id: 1
 *         post_id: 10
 *         content: un super commentaire
 *         published_at: 2022-12-17T03:24:00
 *         created_at: 2022-12-17T03:24:00
 *         updated_at: 2022-12-18T03:24:00
 */
export default class Comment {
    constructor(
        public id: number,
        public user_id: number,
        public post_id: number,
        public content: string,
        public published_at: Date,
        public created_at: Date,
        public updated_at: Date | null,
    ) {}
}

export type CommentFullData = Comment & { username: string };
