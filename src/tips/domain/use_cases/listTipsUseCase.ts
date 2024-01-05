import TipsRepositoryInterface from '../ports/tipsRepositoryInterface';
import * as dotenv from 'dotenv';
import Tips from '../models/Tips';
import PaginatedResponse from '../../../_common/domain/models/paginatedResponse';
import PaginatedInput from '../../../_common/domain/models/paginatedInput';
dotenv.config();

export interface ListTipsUsecaseInterface {
    getList(userId: number, input: PaginatedInput, tagId?: number): Promise<PaginatedResponse<Tips>>;
}

export default class ListTipsUseCase implements ListTipsUsecaseInterface {
    constructor(private readonly _tipsRepository: TipsRepositoryInterface) {}

    async getList(userId: number, input: PaginatedInput, tagId?: number): Promise<PaginatedResponse<Tips>> {
        const tipsList = await this._tipsRepository.getList(userId, input.page, input.length, tagId);
        return new PaginatedResponse(input.page, input.length, tipsList.total, tipsList.tips);
    }
}
