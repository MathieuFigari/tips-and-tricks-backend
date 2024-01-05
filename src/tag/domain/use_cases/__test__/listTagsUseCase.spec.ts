import ListTagUseCase from '../listTagsUseCase';
import Tag from '../../model/tag';
import TagRepositoryInMemory from 'src/tag/server-side/tagRepositoryInMemory';
import TagTestBuilder from './TagTestBuilder';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
dotenv.config();

describe('Return tips list', () => {
    let tagRepository: TagRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        tagRepository = new TagRepositoryInMemory();
        sut = new SUT(tagRepository);
    });

    afterEach(() => {
        tagRepository.clear();
    });

    test('can return all tags', async () => {
        const expectedTags = sut.givenAListOfTags();

        const listOfTags = await new ListTagUseCase(tagRepository).getList();
        expect(listOfTags).toEqual(expectedTags);
    });
});

class SUT {
    private _tagTestBuilder: TagTestBuilder;
    public nbOfTags: number = 15;
    constructor(private readonly _tagRepositoryInMemory: TagRepositoryInMemory) {
        this._tagTestBuilder = new TagTestBuilder();
    }

    givenATag(): Tag {
        const tag = this._tagTestBuilder.withLabel(faker.lorem.words({ min: 2, max: 4 })).buildTag();
        this._tagRepositoryInMemory.setTag(tag);
        return tag;
    }

    givenAListOfTags(): Array<Tag> {
        const listOfTags = [];
        for (let i = 0; i < this.nbOfTags; i++) {
            listOfTags.push(this.givenATag());
        }

        return listOfTags;
    }
}
