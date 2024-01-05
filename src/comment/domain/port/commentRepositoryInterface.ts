import { CommentFullData } from '../model/comment';
import InputCreateComment from '../model/inputCreateComment';

export default interface CommentRepositoryInterface {
    getList(
        start: number,
        length: number,
        postId: number,
    ): Promise<{ comments: CommentFullData[]; totalCount: number }>;
    create(input: InputCreateComment, userName: string): Promise<CommentFullData>;
}
