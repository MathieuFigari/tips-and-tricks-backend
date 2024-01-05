import Tag from '../../../tag/domain/model/tag';

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
 *         - tags
 *       properties:
 *         title:
 *           type: string
 *         command:
 *           type: string
 *         description:
 *           type: string
 *         user_id:
 *           type: number
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *       example:
 *         title: Exemple de tips !
 *         command: npm run dev
 *         description: Tips incroyable.
 *         user_id: 2
 *         tags: [{id: 1, label: "tag1"}, {id: 2, label: "tag2"}]
 */
export default class InputCreateTips {
    constructor(
        public title: string,
        public command: string,
        public description: string | null,
        public user_id: number,
        public tags: Tag[],
    ) {}
}
