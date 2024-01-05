import { faker } from '@faker-js/faker';
import InputCreateComment from '../../model/inputCreateComment';
import CommentTestBuilder from './commentTestBuilder';
import CommentRepositoryInMemory from 'src/comment/server-side/commentRepositoryInMemory';
import CreateCommentUseCase from '../createCommentUseCase';

describe('Create a comment', () => {
    let commentRepository: CommentRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        commentRepository = new CommentRepositoryInMemory();
        sut = new SUT(commentRepository);
    });

    afterEach(() => {
        commentRepository.clear();
    });

    test('can create a new comment', async () => {
        const inputCreateComment = sut.givenAnInputCreateComment();
        const expectedComment = sut.givenAnExpectedCommentFullData(inputCreateComment, 'user1');

        const commentCreated = await new CreateCommentUseCase(commentRepository).create(inputCreateComment, 'user1');

        expect(commentCreated).toEqual(expectedComment);
    });

    test('returns an error message if save failed', async () => {
        try {
            const inputCreateComment = sut.givenAnInputCreateComment();
            sut.givenAnError();

            await new CreateCommentUseCase(commentRepository).create(inputCreateComment, 'user1');

            expect(false).toEqual(true);
        } catch (err) {
            expect(err.message).toEqual('Create comment failed !');
        }
    });
});

class SUT {
    private _commentTestBuilder: CommentTestBuilder;
    constructor(private readonly _commentRepositoryInMemory: CommentRepositoryInMemory) {
        this._commentTestBuilder = new CommentTestBuilder();
    }

    givenAnInputCreateComment(): InputCreateComment {
        return {
            user_id: 3,
            content: faker.lorem.paragraph({ min: 1, max: 2 }),
            post_id: 1,
        };
    }

    givenAnExpectedCommentFullData(input: InputCreateComment, username: string) {
        return this._commentTestBuilder
            .withId(1)
            .withUserId(input.user_id)
            .withPostId(input.post_id)
            .withContent(input.content)
            .withUsername(username)
            .buildCommentFullData();
    }

    givenAnError(): CommentRepositoryInMemory {
        return this._commentRepositoryInMemory.setError();
    }
}
