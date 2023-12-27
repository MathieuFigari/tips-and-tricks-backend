import Tips from '../../models/Tips';
import TipsRepositoryInMemory from '../../../server-side/repositories/tipsRepositoryInMemory';
import TipsTestBuilder from './TipsTestBuilder';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import InputCreateTips from '../../models/inputCreateTips';
import CreateTipsUseCase from '../createTipsUseCase';
dotenv.config();

describe('Return a tips', () => {
    let tipsRepository: TipsRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        tipsRepository = new TipsRepositoryInMemory();
        sut = new SUT(tipsRepository);
    });

    afterEach(() => {
        tipsRepository.clear();
    });

    test('can create a new tips', async () => {
        const inputTips = sut.givenAnInputTips();
        const expectedTips = sut.givenAJustCreatedTips(inputTips);
        const tipsJustCreated = await new CreateTipsUseCase(tipsRepository).create(inputTips);

        expect(tipsJustCreated).toEqual(expectedTips);
    });

    test('return an errors message if persist tips failed and return null', async () => {
        try {
            const inputTips = sut.givenAnInputTips();
            sut.givenAnError();
            await new CreateTipsUseCase(tipsRepository).create(inputTips);

            //This expect breaks the test because it must throw an error
            expect(false).toEqual(true);
        } catch (err) {
            expect(err.message).toEqual('Create tips failed !');
        }
    });

    test('an input must have the good format', async () => {
        try {
            const inputTips = sut.givenAnInputTipsWithBadInputFormat();
            await new CreateTipsUseCase(tipsRepository).create(inputTips);

            //This expect breaks the test because it must throw an error
            expect(false).toEqual(true);
        } catch (err) {
            expect(err.message).toEqual('Create tips failed !');
        }
    });
});

class SUT {
    private _tipsTestBuilder: TipsTestBuilder;
    constructor(private readonly _tipsRepositoryInMemory: TipsRepositoryInMemory) {
        this._tipsTestBuilder = new TipsTestBuilder();
    }

    givenAnInputTips(): InputCreateTips {
        return {
            title: faker.lorem.words(3),
            command: faker.lorem.words(5),
            description: faker.lorem.words(10),
            user_id: 4,
        };
    }

    givenAJustCreatedTips(inputTips: InputCreateTips): Tips {
        return this._tipsTestBuilder
            .withId(1)
            .withUserId(inputTips.user_id)
            .withTitle(inputTips.title)
            .withCommand(inputTips.command)
            .withDescription(inputTips.description)
            .buildTips();
    }

    givenAnError(): TipsRepositoryInMemory {
        return this._tipsRepositoryInMemory.setError();
    }

    givenAnInputTipsWithBadInputFormat(): InputCreateTips {
        return {
            title: '',
            command: faker.lorem.words(5),
            description: faker.lorem.words(10),
            user_id: 4,
        };
    }
}
