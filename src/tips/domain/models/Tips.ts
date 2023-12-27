/**
 * @swagger
 * components:
 *   schemas:
 *     Tips:
 *       type: object
 *       required:
 *         - id
 *         - user_id
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
 *         command:
 *           type: string
 *         description:
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
 *         published_at: 2022-12-17T03:24:00
 *         created_at: 2022-12-17T03:24:00
 *         updated_at: 2022-12-18T03:24:00
 */
export default class Tips {
    constructor(
        public id: number,
        public user_id: number,
        public title: string,
        public command: string,
        public description: string | null,
        public published_at: Date,
        public created_at: Date,
        public updated_at: Date | null,
    ) {}
}
