import Post, { PostFullData } from '../model/post';
import PostRepositoryInterface from '../ports/postRepositoryInterface';
import NotFoundError from '../../../_common/domain/errors/notFoundError';

export interface GetPostUseCaseInterface {
    getPost(postId: number): Promise<Post | null>;
}

export default class GetPostUseCase implements GetPostUseCaseInterface {
    constructor(private readonly _postRepository: PostRepositoryInterface) {}

    async getPost(postId: number): Promise<PostFullData | null> {
        const post = await this._postRepository.getPost(postId);

        if (!post) throw new NotFoundError('Get post failed !');

        return post;
    }
}
