import Tag from '../../../tag/domain/model/tag';

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
 *         - tags
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
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
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
        public tags: Tag[],
        public user_id: number,
    ) {}
}
