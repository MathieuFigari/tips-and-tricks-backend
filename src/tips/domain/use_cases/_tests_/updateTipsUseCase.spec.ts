import Tips from '../../models/Tips';
import TipsRepositoryInMemory from '../../../server-side/repositories/tipsRepositoryInMemory';
import TipsTestBuilder from './TipsTestBuilder';
import * as dotenv from 'dotenv';
import InputCreateTips from '../../models/inputCreateTips';
import UpdateTipsUseCase from '../updateTipsUseCase';
import InputUpdateTips from '../../models/InputUpdateTips';
import { faker } from '@faker-js/faker';
dotenv.config();

describe('Return a modified tips', () => {
    let tipsRepository: TipsRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        tipsRepository = new TipsRepositoryInMemory();
        sut = new SUT(tipsRepository);
    });

    afterEach(() => {
        tipsRepository.clear();
    });

    test('can update a tips', async () => {
        const inputCreateTips = sut.givenAnInputCreateTips();
        sut.givenATips(inputCreateTips);

        const inputUpdateTips = sut.givenAnInputUpdateTips();
        const expectedTips = sut.givenATips(inputUpdateTips);

        const tipsJustUpdated = await new UpdateTipsUseCase(tipsRepository).update(inputUpdateTips);
        expect(tipsJustUpdated).toEqual(expectedTips);
    });

    test('return an error message if persist tips failed and return null', async () => {
        try {
            const inputUpdateTips = sut.givenAnInputUpdateTips();
            sut.givenAnError();
            await new UpdateTipsUseCase(tipsRepository).update(inputUpdateTips);

            //This expect breaks the test because it must throw an error
            expect(false).toEqual(true);
        } catch (err) {
            expect(err._statusCode).toEqual(400);
            expect(err.message).toEqual('Updated tips failed !');
        }
    });

    test('an input must have the good format', async () => {
        try {
            const inputUpdateTips = sut.givenAnInputTipsWithBadInputFormat();
            await new UpdateTipsUseCase(tipsRepository).update(inputUpdateTips);

            //This expect breaks the test because it must throw an error
            expect(false).toEqual(true);
        } catch (err) {
            expect(err._statusCode).toEqual(400);
            expect(err.message).toEqual('Updated tips failed !');
        }
    });
});

class SUT {
    private _tipsTestBuilder: TipsTestBuilder;
    constructor(private readonly _tipsRepositoryInMemory: TipsRepositoryInMemory) {
        this._tipsTestBuilder = new TipsTestBuilder();
    }

    givenAnInputCreateTips(): InputCreateTips {
        return {
            title: faker.lorem.words(3),
            command: faker.lorem.words(5),
            description: faker.lorem.words(10),
            user_id: 1,
        };
    }

    givenAnInputUpdateTips(): InputUpdateTips {
        return {
            id: 1,
            title: faker.lorem.words(3),
            command: faker.lorem.words(5),
            description: faker.lorem.words(10),
            user_id: 1,
        };
    }

    givenATips(input: InputCreateTips): Tips {
        const tips = this._tipsTestBuilder
            .withTitle(input.title)
            .withCommand(input.command)
            .withDescription(input.description)
            .buildTips();
        this._tipsRepositoryInMemory.setTips(tips);
        return tips;
    }

    givenAnError(): TipsRepositoryInMemory {
        return this._tipsRepositoryInMemory.setError();
    }

    givenAnInputTipsWithBadInputFormat(): InputUpdateTips {
        return {
            id: 1,
            title: '',
            command: faker.lorem.words(5),
            description: faker.lorem.words(10),
            user_id: 4,
        };
    }
}
