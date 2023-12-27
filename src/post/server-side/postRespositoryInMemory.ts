import PostRepositoryInterface from '../domain/ports/postRepositoryInterface';
import Post, { PostFullData } from '../domain/model/post';
import InputCreatePost from '../domain/model/inputCreatePost';

export default class PostRepositoryInMemory implements PostRepositoryInterface {
    public postInMemory: Array<PostFullData> = [];
    private _error: boolean = false;

    async getList(start: number, length: number): Promise<PostFullData[]> {
        return this.postInMemory.slice(start, start + length);
    }

    async create(input: InputCreatePost & { slug: string }): Promise<Post | null> {
        if (!this._error) {
            return new Post(
                1,
                input.user_id,
                input.title,
                input.slug,
                input.description,
                input.message,
                input.command,
                {
                    like: 10,
                    dislike: 10,
                },
                new Date('2022-12-17T03:24:00'),
                new Date('2022-12-17T03:24:00'),
                null,
            );
        }
        return null;
    }

    async getPost(postId: number): Promise<PostFullData | null> {
        const post = this.postInMemory.splice(postId - 1, 1);

        if (!post) return null;
        if (!post) return null;

        return post.shift();
    }

    setPost(post: PostFullData): PostRepositoryInMemory {
        this.postInMemory.push(post);
        return this;
    }

    setError(): PostRepositoryInMemory {
        this._error = true;
        return this;
    }

    clear(): PostRepositoryInMemory {
        this.postInMemory = [];
        return this;
    }
}
