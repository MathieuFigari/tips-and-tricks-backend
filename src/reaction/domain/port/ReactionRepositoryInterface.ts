import Reaction, { ReactionType } from '../model/reaction';

export default interface ReactionRepositoryInterface {
    addReaction(user_id: number, post_id: number, reaction: ReactionType): Promise<Reaction | null>;
    removeReaction(user_id: number, post_id: number): Promise<boolean>;
    reactionExist(user_id: number, post_id: number): Promise<Reaction | null>;
    getReactionForCurrentUser(userId: number, postId: number): Promise<ReactionType | null>;
    getAllReactionsForPost(post_id: number): Promise<{ likes: number; dislikes: number }>;
}
