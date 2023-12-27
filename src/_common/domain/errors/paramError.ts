export default class ParamError extends Error {
    private _statusCode: number = 400;
    _code: string = 'PARAM_ERROR';
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
