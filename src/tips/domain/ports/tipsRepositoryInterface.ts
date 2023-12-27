import Tips from '../models/Tips';
import InputCreateTips from '../models/inputCreateTips';
import InputUpdateTips from '../models/InputUpdateTips';

export type TipsList = {
    tips: Tips[];
    total: number;
};

export default interface TipsRepositoryInterface {
    getList(userId: number, page: number, length: number): Promise<TipsList>;
    delete(userId: number, tipsId: number): Promise<boolean>;
    create(input: InputCreateTips): Promise<Tips>;
    update(input: InputUpdateTips): Promise<Tips>;
}
