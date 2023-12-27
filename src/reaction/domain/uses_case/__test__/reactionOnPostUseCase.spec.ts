import { faker } from '@faker-js/faker';
import ReactionOnPostUseCase from '../reactionOnPostUseCase';
import ReactionRepositoryInMemory from '../../../server-side/reactionRepositoryInMemory';
import User from '../../../../user/domain/models/User';
import PostTestBuilder from '../../../../post/domain/use_cases/__test__/PostTestBuilder';
import UserTestBuilder from '../../../../user/domain/use_cases/__tests__/UserTestBuilder';
import Post from '../../../../post/domain/model/post';
import { ReactionType, UserReactionWithLikesDislikes } from '../../model/reaction';
import InputReaction from '../../model/inputReaction';

describe('A reaction on post use case', () => {
    let reactionRepository: ReactionRepositoryInMemory;
    let sut: SUT;
    let user: User;
    let initialNumberOfLikes: number;
    let initialNumberOfDislikes: number;

    beforeEach(() => {
        reactionRepository = new ReactionRepositoryInMemory();
        user = new UserTestBuilder().buildUser();

        sut = new SUT(reactionRepository);
        initialNumberOfLikes = faker.number.int({ min: 0, max: 10 });
        initialNumberOfDislikes = faker.number.int({ min: 0, max: 10 });
    });

    test('should be able to like a post', async () => {
        const postToLike = sut.givenAPost(initialNumberOfLikes, 0);
        const inputReaction = sut.givenAnInputReaction(postToLike.id, user.id, 'like');
        const expectedReaction = sut.givenAReaction(postToLike.id, user.id, ReactionType.like);
        const reaction = await new ReactionOnPostUseCase(reactionRepository).reactionOnPost(inputReaction);
        expect(reaction).toEqual(expectedReaction);
        expect(postToLike.reactions.like).toBe(initialNumberOfLikes + 1);
    });

    test('should be able to dislike a post', async () => {
        const postToDislike = sut.givenAPost(0, initialNumberOfDislikes);
        const inputReaction = sut.givenAnInputReaction(postToDislike.id, user.id, 'dislike');
        const expectedReaction = sut.givenAReaction(postToDislike.id, user.id, ReactionType.dislike);
        const reaction = await new ReactionOnPostUseCase(reactionRepository).reactionOnPost(inputReaction);
        expect(reaction).toEqual(expectedReaction);
        expect(postToDislike.reactions.dislike).toBe(initialNumberOfDislikes + 1);
    });

    test('should be able to remove a reaction on a post', async () => {
        const post = sut.givenAPost(initialNumberOfLikes, initialNumberOfDislikes);
        const inputReaction = sut.givenAnInputReaction(post.id, user.id, 'like');
        const expectedReaction = sut.givenAReaction(post.id, user.id, null);
        await new ReactionOnPostUseCase(reactionRepository).reactionOnPost(inputReaction);
        const isNoReaction = await new ReactionOnPostUseCase(reactionRepository).reactionOnPost({
            ...inputReaction,
            reaction: null,
        });
        expect(isNoReaction).toEqual(expectedReaction);
        expect(reactionRepository.posts[0].reactions.like).toBe(initialNumberOfLikes);
    });

    test('should return an error if the reaction not exist', async () => {
        try {
            const inputReaction = sut.givenAnInputReaction(3, user.id, 'hate');
            await new ReactionOnPostUseCase(reactionRepository).reactionOnPost(inputReaction);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe('Reaction not exist');
        }
    });

    test('should remove the reaction like and add a reaction dislike if a user dislike a post which he had been liked before', async () => {
        const post = sut.givenAPost(initialNumberOfLikes, initialNumberOfDislikes);
        const inputReaction = sut.givenAnInputReaction(post.id, user.id, 'like');
        await new ReactionOnPostUseCase(reactionRepository).reactionOnPost(inputReaction);

        const inputReactionDislike = sut.givenAnInputReaction(post.id, user.id, 'dislike');
        await new ReactionOnPostUseCase(reactionRepository).reactionOnPost(inputReactionDislike);

        expect(reactionRepository.posts[0].reactions.like).toBe(initialNumberOfLikes);
        expect(reactionRepository.posts[0].reactions.dislike).toBe(initialNumberOfDislikes + 1);
    });

    test('should retrieve user reaction on a post when the user is logged', async () => {
        const post = sut.givenAPost(initialNumberOfLikes, initialNumberOfDislikes);
        const inputReaction = sut.givenAnInputReaction(post.id, user.id, 'like');
        const expectedReaction = sut.givenAReaction(post.id, user.id, ReactionType.like);
        await new ReactionOnPostUseCase(reactionRepository).reactionOnPost(inputReaction);
        const reaction = await new ReactionOnPostUseCase(reactionRepository).getReactionForCurrentUser(
            user.id,
            post.id,
        );
        expect(reaction).toEqual(expectedReaction);
    });

    test('should return a null reaction if the user had not interact with the post', async () => {
        const post = sut.givenAPost(initialNumberOfLikes, initialNumberOfDislikes);
        const expectedReaction = sut.givenAReaction(post.id, user.id, null);
        const reaction = await new ReactionOnPostUseCase(reactionRepository).getReactionForCurrentUser(
            user.id,
            post.id,
        );
        expect(reaction).toEqual(expectedReaction);
    });
});

class SUT {
    private _postTestBuilder: PostTestBuilder;
    constructor(private readonly _reactionRepository: ReactionRepositoryInMemory) {
        this._postTestBuilder = new PostTestBuilder();
    }

    givenAPost(numberOfLikes: number, numberOfDislikes: number): Post {
        const post = this._postTestBuilder
            .withTitle(faker.lorem.words(3))
            .withCommand(faker.lorem.words({ min: 3, max: 9 }))
            .withDescription(faker.lorem.text())
            .withMessage(faker.lorem.text())
            .withSlug(faker.lorem.words(3))
            .withUserId(faker.number.int({ min: 1, max: 10 }))
            .withUsername(faker.internet.userName())
            .withLikes(numberOfLikes)
            .withDislikes(numberOfDislikes)
            .buildPost();
        this._reactionRepository.setPost(post);
        return post;
    }

    givenAnInputReaction(postId: number, userId: number, reaction: string): InputReaction {
        return {
            post_id: postId,
            user_id: userId,
            reaction: reaction,
        };
    }

    givenAReaction(postId: number, userId: number, reaction: ReactionType): UserReactionWithLikesDislikes {
        return {
            likes: 10,
            dislikes: 50,
            reaction: {
                post_id: postId,
                user_id: userId,
                reaction: reaction,
            },
        };
    }
}
