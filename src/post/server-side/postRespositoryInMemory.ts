import PostRepositoryInterface from '../domain/ports/postRepositoryInterface';
import Post, { PostFullData } from '../domain/model/post';
import InputCreatePost from '../domain/model/inputCreatePost';

export default class PostRepositoryInMemory implements PostRepositoryInterface {
    public postInMemory: Array<PostFullData> = [];
    private _error: boolean = false;

    async getList(
        start: number,
        length: number,
        tagId?: number,
    ): Promise<{ posts: PostFullData[]; totalCount: number }> {
        let filteredPosts = this.postInMemory;
        if (tagId) {
            filteredPosts = filteredPosts.filter((post) => post.tags.some((tag) => tag.id === tagId));
        }

        // Total count of posts after filtering
        const totalCount = filteredPosts.length;

        // Slice for pagination
        const paginatedPosts = filteredPosts.slice(start, start + length);

        // Map to PostFullData structure, if necessary
        const posts = paginatedPosts.map((post) => ({
            ...post,
            // ... other properties as needed
            comment_count: post.comment_count,
        }));

        return { posts, totalCount };
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
                input.tags,
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
        const post = this.postInMemory.find((post) => post.id === postId);
        if (post) {
            return {
                ...post,
                comment_count: post.comment_count,
            };
        }
        return null;
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
