import Post, { PostFullData } from '../../model/post';
import PostRepositoryInMemory from '../../../server-side/postRespositoryInMemory';
import PostTestBuilder from './PostTestBuilder';
import { faker } from '@faker-js/faker';
import InfiniteResponse from '../../../../_common/domain/models/infiniteResponse';
import ListPostUseCase from '../listPostsUseCase';

describe('Return a list of posts', () => {
    let postRepository: PostRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        postRepository = new PostRepositoryInMemory();

        sut = new SUT(postRepository);
    });

    afterEach(() => {
        postRepository.clear();
    });

    test.each`
        start | length | numberOfPosts
        ${0}  | ${2}   | ${6}
        ${1}  | ${2}   | ${6}
        ${2}  | ${4}   | ${15}
        ${3}  | ${6}   | ${30}
    `('can return posts with a start and a limit', async ({ start, length, numberOfPosts }) => {
        const expectedPosts = sut.givenAListOfPosts(numberOfPosts);
        const expectedResponse = sut.buildAnInifiniteResponse(start, length, expectedPosts);

        const listOfPosts = await new ListPostUseCase(postRepository).getList({ start, length });
        expect(listOfPosts).toEqual(expectedResponse);
    });

    test('can return InfiniteResponse with empty data if there is no tips in bdd', async () => {
        const expectedResponse = sut.buildAnInifiniteResponse(0, 2, []);

        const listOfPosts = await new ListPostUseCase(postRepository).getList({ start: 0, length: 2 });
        expect(listOfPosts).toEqual(expectedResponse);
    });
});

class SUT {
    private _postTestBuilder: PostTestBuilder;
    constructor(private readonly _postRepository: PostRepositoryInMemory) {
        this._postTestBuilder = new PostTestBuilder();
    }

    givenAPost(): PostFullData {
        const post = this._postTestBuilder
            .withTitle(faker.lorem.words(3))
            .withCommand(faker.lorem.words({ min: 3, max: 9 }))
            .withDescription(faker.lorem.text())
            .withMessage(faker.lorem.text())
            .withSlug(faker.lorem.words(3))
            .withUserId(faker.number.int({ min: 1, max: 10 }))
            .withUsername(faker.internet.userName())
            .buildPostFullData();
        this._postRepository.setPost(post);
        return post;
    }

    givenAListOfPosts(count: number): Array<PostFullData> {
        const postList = [];
        for (let i = 0; i < count; i++) {
            postList.push(this.givenAPost());
        }
        return postList;
    }

    buildAnInifiniteResponse(start: number, length: number, posts: Post[]): InfiniteResponse<Post> {
        const expectedPosts = posts.slice(start, start + length);
        return new InfiniteResponse<Post>(start, length, expectedPosts);
    }
}
