/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       required:
 *         - id
 *         - label
 *         - created_at
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the tag.
 *         label:
 *           type: string
 *           description: The label of the tag.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date-time the tag was created.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date-time the tag was last updated.
 *       example:
 *         id: 1
 *         label: JavaScript
 *         created_at: 2022-12-17T03:24:00
 *         updated_at: 2022-12-18T03:24:00
 */
export default class Tag {
    constructor(
        public id: number,
        public label: string,
        public created_at: Date,
        public updated_at: Date | null,
    ) {}
}
