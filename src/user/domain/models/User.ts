export enum Roles {
    admin = 'admin',
    moderator = 'moderator',
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - username
 *         - created_at
 *       properties:
 *         id:
 *           type: number
 *         email:
 *           type: string
 *         username:
 *           type: string
 *         roles:
 *           type: string
 *           enum: ['admin', 'moderator']
 *         created_at:
 *           type: string
 *           format: date
 *         updated_at:
 *           type: string
 *           format: date
 *       example:
 *         id: 4
 *         email: test@test.com
 *         username: johndoe
 *         roles: admin
 *         created_at: 2022-12-17T03:24:00
 *         updated_at: 2022-12-17T03:24:00
 */
export default class User {
    constructor(
        public id: number,
        public email: string,
        public username: string,
        public roles: Roles | null,
        public created_at: Date,
        public updated_at: Date | null,
    ) {}
}

export class JwtToken {
    constructor(
        public access_token: string | null,
        public refresh_token: string | null,
    ) {}
}

export class UserLogged {
    constructor(
        public user: User,
        public tokens: JwtToken,
    ) {}
}
