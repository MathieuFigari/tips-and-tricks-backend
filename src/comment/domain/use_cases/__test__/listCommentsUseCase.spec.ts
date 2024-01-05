import ListCommentsUseCase from '../listCommentsUseCase';
import CommentRepositoryInMemory from 'src/comment/server-side/commentRepositoryInMemory';
import CommentTestBuilder from './commentTestBuilder';
import InfiniteResponse from '../../../../_common/domain/models/infiniteResponse';
import { faker } from '@faker-js/faker';
import Comment, { CommentFullData } from '../../model/comment';

describe('ListCommentsUseCase', () => {
    let commentRepository: CommentRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        commentRepository = new CommentRepositoryInMemory();
        sut = new SUT(commentRepository);
    });

    test('should return a list of comments for a post', async () => {
        const expectedComments = sut.givenAListOfComments(20, 1);

        const start = 0;
        const length = 5;
        const expectedResponse = sut.buildAnInifiniteResponse(start, length, expectedComments);

        const listOfComments = await new ListCommentsUseCase(commentRepository).getList({ start, length }, 1);
        expect(listOfComments).toEqual(expectedResponse);
    });
});

class SUT {
    private _commentTestBuilder: CommentTestBuilder;
    constructor(private readonly _commentRepository: CommentRepositoryInMemory) {
        this._commentTestBuilder = new CommentTestBuilder();
    }

    givenAComment(postId: number): CommentFullData {
        const comment = this._commentTestBuilder
            .withContent(faker.lorem.words(3))
            .withUserId(1)
            .withUsername(faker.internet.userName())
            .withPostId(postId)
            .buildCommentFullData();
        this._commentRepository.setComments(comment);
        return comment;
    }

    givenAListOfComments(count: number, postId: number): Array<CommentFullData> {
        const commentList = [];
        for (let i = 0; i < count; i++) {
            commentList.push(this.givenAComment(postId));
        }
        return commentList;
    }

    buildAnInifiniteResponse(start: number, length: number, comments: Comment[]): InfiniteResponse<Comment> {
        const expectedComment = comments.slice(start, start + length);
        return new InfiniteResponse<Comment>(start, length, expectedComment, comments.length);
    }
}
