/**
 * @swagger
 * components:
 *   schemas:
 *     InputCreateTips:
 *       type: object
 *       required:
 *         - title
 *         - command
 *         - description
 *         - user_id
 *       properties:
 *         title:
 *           type: string
 *         command:
 *           type: string
 *         description:
 *           type: string
 *         user_id:
 *           type: number
 *       example:
 *         title: Exemple de tips !
 *         command: npm run dev
 *         description: Tips incroyable.
 *         user_id: 2
 */
export default class InputCreateTips {
    constructor(
        public title: string,
        public command: string,
        public description: string | null,
        public user_id: number,
    ) {}
}
