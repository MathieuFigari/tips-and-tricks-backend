/**
 * @swagger
 * components:
 *   schemas:
 *     InputRegisterUser:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         email: test@test.com
 *         username: johndoe
 *         password: _qyU1)"v@2^9
 */
export default class InputRegisterUser {
    constructor(
        public email: string,
        public username: string,
        public password: string,
    ) {}
}
