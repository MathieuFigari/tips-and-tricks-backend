import InfiniteInput from '../../../_common/domain/models/infiniteInput';
import InfiniteResponse from '../../../_common/domain/models/infiniteResponse';
import { PostFullData } from '../model/post';
import PostRepositoryInterface from '../ports/postRepositoryInterface';

export interface ListPostUseCaseInterface {
    getList(input: InfiniteInput): Promise<InfiniteResponse<PostFullData>>;
}

export default class ListPostUseCase implements ListPostUseCaseInterface {
    constructor(private readonly _postRepository: PostRepositoryInterface) {}

    async getList(input: InfiniteInput): Promise<InfiniteResponse<PostFullData>> {
        const posts = await this._postRepository.getList(input.start, input.length);
        return new InfiniteResponse(input.start, input.length, posts);
    }
}
