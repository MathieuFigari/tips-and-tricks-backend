import CommentRepositoryInterface from '../domain/port/commentRepositoryInterface';
import Comment, { CommentFullData } from '../domain/model/comment';
import InputCreateComment from '../domain/model/inputCreateComment';

export default class CommentRepositoryInMemory implements CommentRepositoryInterface {
    public commentInMemory: Array<CommentFullData> = [];
    private nextId = 1;
    private _error: boolean = false;

    async getList(
        start: number,
        length: number,
        postId: number,
    ): Promise<{ comments: CommentFullData[]; totalCount: number }> {
        const filteredComments = this.commentInMemory.filter((comment) => comment.post_id === postId);
        const paginatedComments = filteredComments.slice(start, start + length);

        return {
            comments: paginatedComments,
            totalCount: filteredComments.length,
        };
    }

    async create(input: InputCreateComment, userName: string): Promise<CommentFullData> {
        if (!this._error) {
            const newComment = new Comment(
                this.nextId++,
                input.user_id,
                input.post_id,
                input.content,
                new Date('2023-01-01T00:00:00Z'),
                new Date('2023-01-01T00:00:00Z'),
                null,
            );

            this.commentInMemory.push({
                ...newComment,
                username: userName,
            });

            return {
                ...newComment,
                username: userName,
            };
        }
    }

    setComments(comment: CommentFullData): void {
        this.commentInMemory.push(comment);
    }

    setError(): CommentRepositoryInMemory {
        this._error = true;
        return this;
    }

    clear(): CommentRepositoryInMemory {
        this.commentInMemory = [];
        return this;
    }
}
