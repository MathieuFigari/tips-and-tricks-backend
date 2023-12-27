export default class NotFoundError extends Error {
    private _statusCode: number = 404;
    private _code: string = 'NOT_FOUND_ERROR';
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
