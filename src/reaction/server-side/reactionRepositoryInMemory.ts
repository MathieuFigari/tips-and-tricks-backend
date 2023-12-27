import ReactionRepositoryInterface from '../domain/port/ReactionRepositoryInterface';
import Reaction, { ReactionType } from '../domain/model/reaction';
import Post from '../../post/domain/model/post';

export default class ReactionRepositoryInMemory implements ReactionRepositoryInterface {
    public posts: Post[] = [];
    public reactions: Reaction[] = [];
    async addReaction(user_id: number, post_id: number, reaction: ReactionType): Promise<Reaction | null> {
        const newReaction = new Reaction(post_id, user_id, reaction);
        this.reactions.push(newReaction);
        this.updatePostReactions();
        return newReaction;
    }

    async removeReaction(user_id: number, post_id: number): Promise<boolean> {
        const index = this.reactions.findIndex(
            (reaction) => reaction.user_id === user_id && reaction.post_id === post_id,
        );
        const reactionType = this.reactions[index].reaction;
        this.reactions.splice(index, 1);
        this.posts.forEach((post) => {
            post_id === post.id && post.reactions[reactionType]--;
        });
        return true;
    }

    async reactionExist(user_id: number, post_id: number): Promise<Reaction | null> {
        return this.reactions.find((reaction) => reaction.user_id === user_id && reaction.post_id === post_id);
    }

    async getReactionForCurrentUser(userId: number, postId: number): Promise<ReactionType> {
        return this.reactions.find((reaction) => reaction.user_id === userId && reaction.post_id === postId)?.reaction;
    }

    async getAllReactionsForPost(): Promise<{ likes: number; dislikes: number }> {
        return { likes: 10, dislikes: 50 };
    }

    setPost(post: Post): Post {
        this.posts.push(post);
        return post;
    }

    updatePostReactions(): void {
        this.posts.forEach((post) => {
            const postReactions = this.reactions.filter((reaction) => reaction.post_id === post.id);
            const postLikes = postReactions.filter((reaction) => reaction.reaction === 'like').length;
            const postDislikes = postReactions.filter((reaction) => reaction.reaction === 'dislike').length;
            post.reactions.like += postLikes;
            post.reactions.dislike += postDislikes;
        });
    }
}
