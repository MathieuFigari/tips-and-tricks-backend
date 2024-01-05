import InfiniteInput from '../../../_common/domain/models/infiniteInput';
import InfiniteResponse from '../../../_common/domain/models/infiniteResponse';
import { CommentFullData } from '../model/comment';
import CommentRepositoryInterface from '../port/commentRepositoryInterface';

export interface ListCommentsUseCaseInterface {
    getList(input: InfiniteInput, postId: number): Promise<InfiniteResponse<CommentFullData>>;
}

export default class ListCommentsUseCase implements ListCommentsUseCaseInterface {
    constructor(private readonly _commentRepository: CommentRepositoryInterface) {}

    async getList(input: InfiniteInput, postId: number): Promise<InfiniteResponse<CommentFullData>> {
        const { comments, totalCount } = await this._commentRepository.getList(input.start, input.length, postId);
        return new InfiniteResponse(input.start, input.length, comments, totalCount);
    }
}
