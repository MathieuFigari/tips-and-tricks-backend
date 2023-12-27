import TipsRepositoryInMemory from 'src/tips/server-side/repositories/tipsRepositoryInMemory';
import DeleteTipsUseCase from '../deleteUseCase';
import TipsTestBuilder from './TipsTestBuilder';
import Tips from '../../models/Tips';
import { faker } from '@faker-js/faker';

describe('Delete a tip', () => {
    let tipsRepository: TipsRepositoryInMemory;
    let sut: SUT;
    const userId = 1;

    beforeEach(() => {
        tipsRepository = new TipsRepositoryInMemory();
        sut = new SUT(tipsRepository);
    });

    afterEach(() => {
        tipsRepository.clear();
    });

    test('can delete a tip with correct userId', async () => {
        const createdTip = sut.givenATips(userId);
        const deletedSuccessfully = await new DeleteTipsUseCase(tipsRepository).delete(createdTip.id, userId);
        expect(deletedSuccessfully).toEqual(true);
    });

    test('cannot delete a tip with wrong userId', async () => {
        const createdTip = sut.givenATips(userId);
        const wrongUserId = 2;

        try {
            await new DeleteTipsUseCase(tipsRepository).delete(createdTip.id, wrongUserId);
        } catch (err) {
            expect(err.message).toEqual('Delete tips failed !');
        }
    });

    test('return false if tip does not exist', async () => {
        try {
            const nonExistentTipId = 999;
            await new DeleteTipsUseCase(tipsRepository).delete(nonExistentTipId, userId);
        } catch (err) {
            expect(err.message).toEqual('Delete tips failed !');
        }
    });
});

class SUT {
    private _tipsTestBuilder: TipsTestBuilder;
    constructor(private readonly _tipsRepositoryInMemory: TipsRepositoryInMemory) {
        this._tipsTestBuilder = new TipsTestBuilder();
    }

    givenATips(userId: number): Tips {
        const tips = this._tipsTestBuilder
            .withUserId(userId)
            .withTitle(faker.lorem.words({ min: 2, max: 4 }))
            .withCommand(faker.lorem.words({ min: 3, max: 9 }))
            .withDescription(faker.lorem.paragraph({ min: 1, max: 3 }))
            .buildTips();
        this._tipsRepositoryInMemory.setTips(tips);
        return tips;
    }

    givenAnError(): TipsRepositoryInMemory {
        return this._tipsRepositoryInMemory.setError();
    }
}
