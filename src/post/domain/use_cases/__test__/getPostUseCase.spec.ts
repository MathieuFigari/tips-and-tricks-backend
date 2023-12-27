import Post from '../../model/post';
import PostRepositoryInMemory from '../../../server-side/postRespositoryInMemory';
import PostTestBuilder from './PostTestBuilder';
import { faker } from '@faker-js/faker';
import GetPostUseCase from '../getPostUseCase';

describe('Return one post', () => {
    let postRepository: PostRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        postRepository = new PostRepositoryInMemory();
        sut = new SUT(postRepository);
    });

    afterEach(() => {
        postRepository.clear();
    });

    test('can return one post with his id', async () => {
        const postsList = sut.givenAListOfPosts(10);
        const post = await new GetPostUseCase(postRepository).getPost(1);

        expect(postsList[0]).toEqual(post);
    });

    test('can return an error if postId is null or dont exist', async () => {
        try {
            sut.givenAListOfPosts(10);
            await new GetPostUseCase(postRepository).getPost(12);

            //This expect breaks the test because it must throw an error
            expect(false).toEqual(true);
        } catch (err) {
            expect(err.message).toEqual('Get post failed !');
        }
    });
});

class SUT {
    private _postTestBuilder: PostTestBuilder;
    constructor(private readonly _postRepository: PostRepositoryInMemory) {
        this._postTestBuilder = new PostTestBuilder();
    }

    givenAPost(): Post {
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

    givenAListOfPosts(count: number): Array<Post> {
        const postList = [];
        for (let i = 0; i < count; i++) {
            postList.push(this.givenAPost());
        }
        return postList;
    }
}
