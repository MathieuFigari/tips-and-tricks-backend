import dependencyContainer from '../../_dependencyContainer/dependencyContainer';
import RegisterUserUseCase from '../../user/domain/use_cases/registerUserUseCase';
import UserRepositoryInterface from '../../user/domain/ports/userRepositoryInterface';
import UserRepositoryPostgres from '../../user/server-side/repositories/userRepositoryPostgres';
import postgres, { Sql } from 'postgres';
import process from 'process';
import AuthUserUseCase from '../../user/domain/use_cases/authUserUseCase';
import TipsRepositoryInterface from '../../tips/domain/ports/tipsRepositoryInterface';
import TipsRepositoryPostgres from '../../tips/server-side/repositories/tipsRepositoryPostgres';
import ListTipsUseCase from '../../tips/domain/use_cases/listTipsUseCase';
import CreateTipsUseCase from '../../tips/domain/use_cases/createTipsUseCase';
import DeleteTipsUseCase from '../../tips/domain/use_cases/deleteUseCase';
import PostRepositoryPostgres from '../../post/server-side/postRepositoryPostgres';
import UpdateTipsUseCase from '../../tips/domain/use_cases/updateTipsUseCase';
import ListPostUseCase from '../../post/domain/use_cases/listPostsUseCase';
import PostRepositoryInterface from '../../post/domain/ports/postRepositoryInterface';
import GetPostUseCase from '../../post/domain/use_cases/getPostUseCase';
import CreatePostUseCase from '../../post/domain/use_cases/createPostsUseCase';
import ReactionOnPostUseCase from '../../reaction/domain/uses_case/reactionOnPostUseCase';
import ReactionRepositoryInterface from '../../reaction/domain/port/ReactionRepositoryInterface';
import ReactionRepositoryPostgres from '../../reaction/server-side/reactionRepositoryPostgres';
import TagRepositoryInterface from '../../tag/domain/ports/tagRepositoryInterface';
import TagRepositoryPostgres from '../../tag/server-side/tagRepositoryPostgres';
import CommentRepositoryPostgres from '../../comment/server-side/commentRepositoryPostgres';
import ListTagUseCase from '../../tag/domain/use_cases/listTagsUseCase';
import CommentRepositoryInterface from '../../comment/domain/port/commentRepositoryInterface';
import ListCommentsUseCase from '../../comment/domain/use_cases/listCommentsUseCase';
import CreateCommentUseCase from '../../comment/domain/use_cases/createCommentUseCase';
import GetUserInformationsUseCase from '../../user/domain/use_cases/getUserInformationsUseCase';

dependencyContainer.set<Sql>(
    'sql',
    () => {
        return postgres(process.env.DATABASE_URL);
    },
    true,
);

dependencyContainer.set<UserRepositoryInterface>('UserRepository', () => {
    return new UserRepositoryPostgres(dependencyContainer.get<Sql>('sql'));
});

dependencyContainer.set<RegisterUserUseCase>('RegisterUserUseCase', () => {
    return new RegisterUserUseCase(dependencyContainer.get<UserRepositoryInterface>('UserRepository'));
});

dependencyContainer.set<AuthUserUseCase>('AuthUserUseCase', () => {
    return new AuthUserUseCase(dependencyContainer.get<UserRepositoryInterface>('UserRepository'));
});

dependencyContainer.set<GetUserInformationsUseCase>('GetUserInformationsUseCase', () => {
    return new GetUserInformationsUseCase(dependencyContainer.get<UserRepositoryInterface>('UserRepository'));
});

dependencyContainer.set<TipsRepositoryInterface>('TipsRepository', () => {
    return new TipsRepositoryPostgres(dependencyContainer.get<Sql>('sql'));
});

dependencyContainer.set<ListTipsUseCase>('ListTipsUseCase', () => {
    return new ListTipsUseCase(dependencyContainer.get<TipsRepositoryInterface>('TipsRepository'));
});

dependencyContainer.set<CreateTipsUseCase>('CreateTipsUseCase', () => {
    return new CreateTipsUseCase(dependencyContainer.get<TipsRepositoryInterface>('TipsRepository'));
});

dependencyContainer.set<UpdateTipsUseCase>('UpdateTipsUseCase', () => {
    return new UpdateTipsUseCase(dependencyContainer.get<TipsRepositoryInterface>('TipsRepository'));
});

dependencyContainer.set<DeleteTipsUseCase>('DeleteTipsUseCase', () => {
    return new DeleteTipsUseCase(dependencyContainer.get<TipsRepositoryInterface>('TipsRepository'));
});

dependencyContainer.set<PostRepositoryInterface>('PostRepository', () => {
    return new PostRepositoryPostgres(dependencyContainer.get<Sql>('sql'));
});

dependencyContainer.set<ListPostUseCase>('ListPostUseCase', () => {
    return new ListPostUseCase(dependencyContainer.get<PostRepositoryInterface>('PostRepository'));
});

dependencyContainer.set<PostRepositoryInterface>('PostRepository', () => {
    return new PostRepositoryPostgres(dependencyContainer.get<Sql>('sql'));
});

dependencyContainer.set<ListPostUseCase>('ListPostUseCase', () => {
    return new ListPostUseCase(dependencyContainer.get<PostRepositoryInterface>('PostRepository'));
});

dependencyContainer.set<CreatePostUseCase>('CreatePostUseCase', () => {
    return new CreatePostUseCase(dependencyContainer.get<PostRepositoryInterface>('PostRepository'));
});

dependencyContainer.set<ReactionRepositoryInterface>('ReactionRepository', () => {
    return new ReactionRepositoryPostgres(dependencyContainer.get<Sql>('sql'));
});

dependencyContainer.set<ReactionOnPostUseCase>('ReactionOnPostUseCase', () => {
    return new ReactionOnPostUseCase(dependencyContainer.get<ReactionRepositoryInterface>('ReactionRepository'));
});

dependencyContainer.set<GetPostUseCase>('GetPostUseCase', () => {
    return new GetPostUseCase(dependencyContainer.get<PostRepositoryInterface>('PostRepository'));
});

dependencyContainer.set<TagRepositoryInterface>('TagRepository', () => {
    return new TagRepositoryPostgres(dependencyContainer.get<Sql>('sql'));
});

dependencyContainer.set<ListTagUseCase>('ListTagUseCase', () => {
    return new ListTagUseCase(dependencyContainer.get<TagRepositoryInterface>('TagRepository'));
});

dependencyContainer.set<CommentRepositoryInterface>('CommentRepository', () => {
    return new CommentRepositoryPostgres(dependencyContainer.get<Sql>('sql'));
});

dependencyContainer.set<ListCommentsUseCase>('ListCommentsUseCase', () => {
    return new ListCommentsUseCase(dependencyContainer.get<CommentRepositoryInterface>('CommentRepository'));
});

dependencyContainer.set<CreateCommentUseCase>('CreateCommentUseCase', () => {
    return new CreateCommentUseCase(dependencyContainer.get<CommentRepositoryInterface>('CommentRepository'));
});

export default dependencyContainer;
