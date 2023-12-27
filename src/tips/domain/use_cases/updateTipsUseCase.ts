import tipsRepositoryInterface from '../ports/tipsRepositoryInterface';
import * as dotenv from 'dotenv';
import Tips from '../models/Tips';
import InputCreateTips from '../models/inputCreateTips';
import InputError from '../../../_common/domain/errors/inputError';
import debug from 'debug';
import InputUpdateTips from '../models/InputUpdateTips';
dotenv.config();
const logger = debug('tipsandtricks:registerUserUseCase');

export interface updateTipsRepositoryInterface {
    update(input: InputUpdateTips): Promise<Tips>;
}

export default class UpdateTipsUseCase implements updateTipsRepositoryInterface {
    constructor(private readonly _tipsRepository: tipsRepositoryInterface) {}

    async update(input: InputUpdateTips): Promise<Tips> {
        if (!this.inputTipsValidateFormat(input)) {
            logger('format invalid');
            throw new InputError('Updated tips failed !');
        }

        const tipsJustUpdated = await this._tipsRepository.update(input);

        if (!tipsJustUpdated) {
            logger('bdd error');
            throw new InputError('Updated tips failed !');
        }

        return tipsJustUpdated;
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
