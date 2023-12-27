import { faker } from '@faker-js/faker';
import InputCreatePost from '../../model/inputCreatePost';
import PostTestBuilder from './PostTestBuilder';
import PostRepositoryInMemory from '../../../server-side/postRespositoryInMemory';
import Post from '../../model/post';
import CreatePostUseCase from '../createPostsUseCase';
import * as urlSlug from 'url-slug';

describe('Create a post', () => {
    let postRepository: PostRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        postRepository = new PostRepositoryInMemory();
        sut = new SUT(postRepository);
    });

    afterEach(() => {
        postRepository.clear();
    });

    test('can create a new post', async () => {
        const inputCreatePost = sut.givenAnInputCreatePost();
        const expectedPost = sut.givenACreatedPost(inputCreatePost);

        const postCreated = await new CreatePostUseCase(postRepository).create(inputCreatePost);

        expect(postCreated).toEqual(expectedPost);
    });

    test('returns an error message if save failed', async () => {
        try {
            const inputCreatePost = sut.givenAnInputCreatePost();
            sut.givenAnError();

            await new CreatePostUseCase(postRepository).create(inputCreatePost);

            expect(false).toEqual(true); //This expect breaks the test because it must throw an error
        } catch (err) {
            expect(err.message).toEqual('Create post failed !');
        }
    });
});

class SUT {
    private _postTestBuilder: PostTestBuilder;
    constructor(private readonly _postRepositoryInMemory: PostRepositoryInMemory) {
        this._postTestBuilder = new PostTestBuilder();
    }

    givenAnInputCreatePost(): InputCreatePost {
        return {
            user_id: 3,
            message: faker.lorem.paragraph({ min: 1, max: 2 }),
            title: faker.lorem.words({ min: 1, max: 3 }),
            description: faker.lorem.paragraph({ min: 1, max: 2 }),
            command: faker.lorem.words({ min: 1, max: 3 }),
        };
    }

    givenACreatedPost(input: InputCreatePost): Post {
        return this._postTestBuilder
            .withId(1)
            .withTitle(input.title)
            .withSlug(
                urlSlug.convert(input.title, {
                    separator: '-',
                    transformer: urlSlug.LOWERCASE_TRANSFORMER,
                }),
            )
            .withUserId(3)
            .withCommand(input.command)
            .withDescription(input.description)
            .withMessage(input.message)
            .buildPost();
    }

    givenAnError(): PostRepositoryInMemory {
        return this._postRepositoryInMemory.setError();
    }
}
