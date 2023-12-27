/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - id
 *         - user_id
 *         - description
 *         - slug
 *         - message
 *         - title
 *         - command
 *         - published_at
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: number
 *         user_id:
 *           type: number
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         command:
 *           type: string
 *         description:
 *           type: string
 *         message:
 *           type: string
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
 *         title: Un test super utile !
 *         command: npm run dev
 *         description: A voir enfaite...
 *         slug: un-test-super-utile
 *         message: Mon super post !
 *         published_at: 2022-12-17T03:24:00
 *         created_at: 2022-12-17T03:24:00
 *         updated_at: 2022-12-18T03:24:00
 */
export default class Post {
    constructor(
        public id: number,
        public user_id: number,
        public title: string,
        public slug: string,
        public description: string | null,
        public message: string,
        public command: string,
        public reactions: {
            like: number;
            dislike: number;
        },
        public published_at: Date,
        public created_at: Date,
        public updated_at: Date | null,
    ) {}
}

export type PostFullData = Post & { username: string };
