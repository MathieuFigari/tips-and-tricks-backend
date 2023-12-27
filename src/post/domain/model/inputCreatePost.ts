/**
 * @swagger
 * components:
 *   schemas:
 *     InputCreatePost:
 *       type: object
 *       required:
 *         - user_id
 *         - description
 *         - message
 *         - title
 *         - command
 *       properties:
 *         user_id:
 *           type: number
 *         title:
 *           type: string
 *         command:
 *           type: string
 *         description:
 *           type: string
 *         message:
 *           type: string
 *       example:
 *         user_id: 1
 *         title: Un test super utile !
 *         command: npm run dev
 *         description: A voir enfaite...
 *         message: Mon super post !
 */
export default class InputCreatePost {
    constructor(
        public title: string,
        public message: string,
        public description: string | null,
        public command: string,
        public user_id: number,
    ) {}
}
