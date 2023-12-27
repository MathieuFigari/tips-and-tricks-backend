import * as dotenv from 'dotenv';
import InputError from '../../../_common/domain/errors/inputError';
import InputCreatePost from '../model/inputCreatePost';
import Post from '../model/post';
import PostRepositoryInterface from '../ports/postRepositoryInterface';
import * as urlSlug from 'url-slug';
dotenv.config();

export interface CreatePostRepositoryInterface {
    create(input: InputCreatePost): Promise<Post>;
}

export default class CreatePostUseCase implements CreatePostRepositoryInterface {
    constructor(private readonly _postRepository: PostRepositoryInterface) {}

    async create(input: InputCreatePost): Promise<Post> {
        const newPost = await this._postRepository.create({
            ...input,
            slug: urlSlug.convert(input.title, {
                separator: '-',
                transformer: urlSlug.LOWERCASE_TRANSFORMER,
            }),
        });
        if (!newPost) {
            throw new InputError('Create post failed !');
        }
        return newPost;
    }
}
