import ReactionRepositoryInterface from '../port/ReactionRepositoryInterface';
import { ReactionType, UserReactionWithLikesDislikes } from '../model/reaction';
import InputError from '../../../_common/domain/errors/inputError';
import InputReaction from '../model/inputReaction';

export interface ReactionOnPostUseCaseInterface {
    reactionOnPost(input: InputReaction): Promise<UserReactionWithLikesDislikes | null>;
    getReactionForCurrentUser(userId: number, postId: number): Promise<UserReactionWithLikesDislikes | null>;
}

export default class ReactionOnPostUseCase implements ReactionOnPostUseCaseInterface {
    constructor(private readonly reactionRepository: ReactionRepositoryInterface) {}
    async reactionOnPost(input: InputReaction): Promise<UserReactionWithLikesDislikes | null> {
        const reactionExist = await this.reactionRepository.reactionExist(input.user_id, input.post_id);

        if (input.reaction && !Object.keys(ReactionType).includes(input.reaction)) {
            throw new InputError('Reaction not exist');
        }

        if (reactionExist && reactionExist.reaction === input.reaction) {
            await this.removeReaction(input.user_id, input.post_id);
            return {
                reaction: null,
                ...(await this.getAllReactionForPost(input.post_id)),
            };
        }

        if (reactionExist && reactionExist.reaction !== input.reaction) {
            await this.removeReaction(input.user_id, input.post_id);
        }

        const newReaction = await this.reactionRepository.addReaction(
            input.user_id,
            input.post_id,
            input.reaction as ReactionType,
        );
        return {
            reaction: newReaction,
            ...(await this.getAllReactionForPost(input.post_id)),
        };
    }

    async getReactionForCurrentUser(userId: number, postId: number): Promise<UserReactionWithLikesDislikes | null> {
        const reaction = await this.reactionRepository.getReactionForCurrentUser(userId, postId);
        const postReactions = await this.reactionRepository.getAllReactionsForPost(postId);
        return {
            reaction: {
                post_id: postId,
                user_id: userId,
                reaction: reaction || null,
            },
            ...postReactions,
        };
    }

    private async removeReaction(userId: number, postId: number): Promise<void> {
        const isRemove = await this.reactionRepository.removeReaction(userId, postId);
        if (!isRemove) {
            throw new Error('Error while removing reaction');
        }
    }

    private getAllReactionForPost(postId: number): Promise<{ likes: number; dislikes: number }> {
        return this.reactionRepository.getAllReactionsForPost(postId);
    }
}
