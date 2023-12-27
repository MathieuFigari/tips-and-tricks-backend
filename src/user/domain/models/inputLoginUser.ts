/**
 * @swagger
 * components:
 *   schemas:
 *     InputLoginUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         email: test@test.com
 *         password: _qyU1)"v@2^9
 */
export default class InputLoginUser {
    constructor(
        public email: string,
        public password: string,
    ) {}
}
