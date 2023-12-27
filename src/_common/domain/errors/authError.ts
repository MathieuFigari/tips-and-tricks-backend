export default class AuthError extends Error {
    private _statusCode: number = 401;
    _code: string = 'AUTH_ERROR';
    constructor(public message: string) {
        super();
    }

    get statusCode(): number {
        return this._statusCode;
    }

    get code(): string {
        return this._code;
    }
}
