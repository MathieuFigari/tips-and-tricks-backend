import TipsRepositoryInterface, { TipsList } from '../../domain/ports/tipsRepositoryInterface';
import Tag from '../../../tag/domain/model/tag';
import Tips from '../../domain/models/Tips';
import * as dotenv from 'dotenv';
import InputCreateTips from '../../domain/models/inputCreateTips';
import InputUpdateTips from '../../domain/models/InputUpdateTips';
dotenv.config();

export default class TipsRepositoryInMemory implements TipsRepositoryInterface {
    public tipsInMemory: Array<Tips & { tags: Tag[] }> = [];
    private _error: boolean = false;

    async create(input: InputCreateTips): Promise<Tips | null> {
        if (!this._error) {
            this.tipsInMemory.push(
                new Tips(
                    1,
                    input.user_id,
                    input.title,
                    input.command,
                    input.description,
                    input.tags,
                    new Date('2022-12-17T03:24:00'),
                    new Date('2022-12-17T03:24:00'),
                    null,
                ),
            );
            return this.tipsInMemory[0];
        }
        return null;
    }

    async update(input: InputUpdateTips): Promise<Tips> {
        if (!this._error) {
            this.tipsInMemory[input.id - 1] = new Tips(
                1,
                input.user_id,
                input.title,
                input.command,
                input.description,
                input.tags,
                new Date('2022-12-17T03:24:00'),
                new Date('2022-12-17T03:24:00'),
                null,
            );
            return this.tipsInMemory[0];
        }
        return null;
    }

    async getList(userId: number, page: number, length: number, tagId?: number): Promise<TipsList> {
        const start = length * (page - 1);
        const filteredTips = this.tipsInMemory.filter(
            (tip) => tip.user_id === userId && (!tagId || tip.tags.some((tag) => tag.id === tagId)),
        );

        return {
            tips: filteredTips.slice(start, start + length),
            total: filteredTips.length,
        };
    }

    async delete(tipsId: number, userId: number): Promise<boolean> {
        const initialLength = this.tipsInMemory.length;

        this.tipsInMemory = this.tipsInMemory.filter((tip) => !(tip.id === tipsId && tip.user_id === userId));

        return this.tipsInMemory.length !== initialLength;
    }

    setTips(tips: Tips): TipsRepositoryInMemory {
        this.tipsInMemory.push(tips);
        return this;
    }

    setError(): TipsRepositoryInMemory {
        this._error = true;
        return this;
    }

    clear(): TipsRepositoryInMemory {
        this.tipsInMemory = [];
        return this;
    }
}
