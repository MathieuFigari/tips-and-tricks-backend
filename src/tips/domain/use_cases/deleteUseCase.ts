import tipsRepositoryInterface from '../ports/tipsRepositoryInterface';
import * as dotenv from 'dotenv';
import InputError from '../../../_common/domain/errors/inputError';
import debug from 'debug';
dotenv.config();
const logger = debug('tipsandtricks:deleteTipsUseCase');

export interface DeleteTipsRepositoryInterface {
    delete(userId: number, tipsId: number): Promise<boolean>;
}

export default class DeleteTipsUseCase implements DeleteTipsRepositoryInterface {
    constructor(private readonly _tipsRepository: tipsRepositoryInterface) {}

    async delete(tipsId: number, userId: number): Promise<boolean> {
        try {
            const result = await this._tipsRepository.delete(tipsId, userId);
            if (!result) {
                logger('bdd error');
                throw new InputError('Delete tips failed !');
            }
            return result;
        } catch (error) {
            logger('unexpected error:', error);
            throw new InputError('Delete tips failed !');
        }
    }
}
