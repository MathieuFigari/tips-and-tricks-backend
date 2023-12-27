import tipsRepositoryInterface from '../ports/tipsRepositoryInterface';
import * as dotenv from 'dotenv';
import Tips from '../models/Tips';
import InputCreateTips from '../models/inputCreateTips';
import InputError from '../../../_common/domain/errors/inputError';
import debug from 'debug';
dotenv.config();
const logger = debug('tipsandtricks:registerUserUseCase');

export interface CreateTipsRepositoryInterface {
    create(input: InputCreateTips): Promise<Tips>;
}

export default class CreateTipsUseCase implements CreateTipsRepositoryInterface {
    constructor(private readonly _tipsRepository: tipsRepositoryInterface) {}

    async create(input: InputCreateTips): Promise<Tips> {
        if (!this.inputTipsValidateFormat(input)) {
            logger('format invalid');
            throw new InputError('Create tips failed !');
        }

        const tipsJustCreated = await this._tipsRepository.create(input);

        if (!tipsJustCreated) {
            logger('bdd error');
            throw new InputError('Create tips failed !');
        }
        return tipsJustCreated;
    }

    private inputTipsValidateFormat(inputTipsData: InputCreateTips): boolean {
        const isValid: boolean[] = [];

        for (const [inputKey, value] of Object.entries(inputTipsData)) {
            switch (inputKey) {
                case 'title':
                    isValid.push(this._checkFormat(value));
                    break;
                case 'command':
                    isValid.push(this._checkFormat(value));
                    break;
            }
        }
        return isValid.every((item) => item);
    }

    public _checkFormat(value: string): boolean {
        const regex = /\w+/g;
        return regex.test(value);
    }
}
