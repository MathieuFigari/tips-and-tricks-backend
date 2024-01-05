/**
 * @swagger
 * components:
 *   schemas:
 *     InputCreatePost:
 *       type: object
 *       required:
 *         - user_id
 *         - post_id
 *         - content
 *       properties:
 *         user_id:
 *           type: number
 *         post_id:
 *           type: number
 *         content:
 *           type: string
 *       example:
 *         user_id: 1
 *         title: Un test super utile !
 *         command: npm run dev
 *         description: A voir enfaite...
 *         message: Mon super post !
 */
export default class InputCreateComment {
    constructor(
        public content: string,
        public user_id: number,
        public post_id: number,
    ) {}
}
