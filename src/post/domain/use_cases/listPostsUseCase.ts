import InfiniteInput from '../../../_common/domain/models/infiniteInput';
import InfiniteResponse from '../../../_common/domain/models/infiniteResponse';
import { PostFullData } from '../model/post';
import PostRepositoryInterface from '../ports/postRepositoryInterface';

export interface ListPostUseCaseInterface {
    getList(input: InfiniteInput, tagId?: number): Promise<InfiniteResponse<PostFullData>>;
}

export default class ListPostUseCase implements ListPostUseCaseInterface {
    constructor(private readonly _postRepository: PostRepositoryInterface) {}

    async getList(input: InfiniteInput, tagId?: number, search?: string): Promise<InfiniteResponse<PostFullData>> {
        const { posts, totalCount } = await this._postRepository.getList(input.start, input.length, tagId, search);
        return new InfiniteResponse(input.start, input.length, posts, totalCount);
    }
}
