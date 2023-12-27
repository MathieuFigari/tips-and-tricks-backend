export default class InputError extends Error {
    protected _statusCode: number = 400;
    protected _code: string = 'INPUT_ERROR';
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

export class EmailAlreadyExistInputError extends InputError {
    readonly _code: string = 'EMAIL_ALREADY_EXIST_ERROR';
    constructor(public message: string) {
        super(message);
    }

    get code(): string {
        return this._code;
    }
}

export class UsernameAlreadyExistInputError extends InputError {
    readonly _code: string = 'USERNAME_ALREADY_EXIST_ERROR';
    constructor(public message: string) {
        super(message);
    }
}
