import ListTipsUseCase from '../listTipsUseCase';
import Tips from '../../models/Tips';
import TipsRepositoryInMemory from '../../../server-side/repositories/tipsRepositoryInMemory';
import TipsTestBuilder from './TipsTestBuilder';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import PaginatedResponse from '../../../../_common/domain/models/paginatedResponse';
dotenv.config();

describe('Return tips list', () => {
    let tipsRepository: TipsRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        tipsRepository = new TipsRepositoryInMemory();
        sut = new SUT(tipsRepository);
    });

    afterEach(() => {
        tipsRepository.clear();
    });

    test('can return all user tips in a paginated response', async () => {
        const expectedTips = sut.givenAListOfTips();
        const expectedResponse = sut.buildAPaginatedResponse(1, sut.nbOfTips, expectedTips);

        const listOfTip = await new ListTipsUseCase(tipsRepository).getList(1, { page: 1, length: sut.nbOfTips });
        expect(listOfTip).toEqual(expectedResponse);
    });

    test('not returns another user tips in a paginated response', async () => {
        const expectedTips = sut.givenAListOfTips();
        sut.buildAPaginatedResponse(1, sut.nbOfTips, expectedTips);

        const listOfTip = await new ListTipsUseCase(tipsRepository).getList(1, { page: 1, length: sut.nbOfTips });
        const anotherUserTipsNb = listOfTip.data.filter((element) => element.user_id !== 1);
        expect(anotherUserTipsNb.length).toEqual(0);
    });

    test('can return an PaginatedResponse with empty data if there is no tips in bdd', async () => {
        const expectedResponse = sut.buildAPaginatedResponse(1, sut.nbOfTips, []);

        const listOfTips = await new ListTipsUseCase(tipsRepository).getList(1, { page: 1, length: sut.nbOfTips });
        expect(listOfTips).toEqual(expectedResponse);
    });

    test.each`
        page | length
        ${1} | ${10}
        ${2} | ${14}
        ${4} | ${3}
    `('can returns $length tips in the page $page', async ({ page, length }) => {
        const execptedlistOfTips = sut.givenAListOfTips();
        const expectedResponse = sut.buildAPaginatedResponse(
            page,
            length,
            execptedlistOfTips.slice((page - 1) * length, length * page),
        );

        const listOfTips = await new ListTipsUseCase(tipsRepository).getList(1, { page: page, length: length });
        expect(listOfTips.data.length).toEqual(length);
        expect(listOfTips).toEqual(expectedResponse);
    });
});

class SUT {
    private _tipsTestBuilder: TipsTestBuilder;
    public nbOfTips: number = 100;
    constructor(private readonly _tipsRepositoryInMemory: TipsRepositoryInMemory) {
        this._tipsTestBuilder = new TipsTestBuilder();
    }

    givenATips(): Tips {
        const tips = this._tipsTestBuilder
            .withTitle(faker.lorem.words({ min: 2, max: 4 }))
            .withCommand(faker.lorem.words({ min: 3, max: 9 }))
            .withDescription(faker.lorem.paragraph({ min: 1, max: 3 }))
            .buildTips();
        this._tipsRepositoryInMemory.setTips(tips);
        return tips;
    }

    givenAListOfTips(): Array<Tips> {
        const listOfTips = [];
        for (let i = 0; i < this.nbOfTips; i++) {
            listOfTips.push(this.givenATips());
        }

        return listOfTips;
    }

    buildAPaginatedResponse(page: number, length: number, tips: Tips[]): PaginatedResponse<Tips> {
        return new PaginatedResponse<Tips>(page, length, this._tipsRepositoryInMemory.tipsInMemory.length, tips);
    }
}
