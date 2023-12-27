import { NextFunction, Response, Router } from 'express';
import RegisterUserUseCase from '../../user/domain/use_cases/registerUserUseCase';
import ListTipsUseCase from '../../tips/domain/use_cases/listTipsUseCase';
import CreateTipsUseCase from '../../tips/domain/use_cases/createTipsUseCase';
import dependencyContainer from '../dependencies/dependencies';
import AuthUserUseCase from '../../user/domain/use_cases/authUserUseCase';
import RegisterController from '../../user/client-side/controllers/registerController';
import AuthController from '../../user/client-side/controllers/authController';
import { RequestLogged } from '../../_common/client-side/types/requestLogged';
import AuthMiddleware from '../../_common/client-side/middlewares/authMiddleware';
import ListTipsController from '../../tips/client-side/controllers/listTipsController';
import createTipsController from '../../tips/client-side/controllers/createTipsController';
import DeleteTipsController from '../../tips/client-side/controllers/deleteTipsController';
import DeleteTipsUseCase from 'src/tips/domain/use_cases/deleteUseCase';
import ListPostsController from '../../post/client-side/controllers/listPostsController';
import ListPostUseCase from '../../post/domain/use_cases/listPostsUseCase';
import updateTipsController from '../../tips/client-side/controllers/updateTipsController';
import UpdateTipsUseCase from '../../tips/domain/use_cases/updateTipsUseCase';
import GetPostUseCase from '../../post/domain/use_cases/getPostUseCase';
import GetPostController from '../../post/client-side/controllers/getPostController';
import createPostController from '../../post/client-side/controllers/createPostsController';
import CreatePostUseCase from '../../post/domain/use_cases/createPostsUseCase';
import ReactionController from '../../reaction/client-side/controllers/reactionController';
import ReactionOnPostUseCase from '../../reaction/domain/uses_case/reactionOnPostUseCase';

const router = Router();

router.get('/test', (_, res) => {
    res.send('Express running on test route !');
});

router.get('/isConnected', new AuthMiddleware().authorize('ACCESS_TOKEN'), (_, res) => {
    res.send('Express running on test route !');
});

router.get('/api/reconnect', async (req: RequestLogged, res: Response, next: NextFunction) => {
    return await new AuthController(dependencyContainer.get<AuthUserUseCase>('AuthUserUseCase')).reconnect(
        req,
        res,
        next,
    );
});

router.post('/api/register', async (req: RequestLogged, res: Response, next: NextFunction) => {
    return await new RegisterController(dependencyContainer.get<RegisterUserUseCase>('RegisterUserUseCase')).register(
        req,
        res,
        next,
    );
});

router.post('/api/login', async (req: RequestLogged, res: Response, next: NextFunction) => {
    return await new AuthController(dependencyContainer.get<AuthUserUseCase>('AuthUserUseCase')).login(req, res, next);
});

router.post(
    '/api/logout',
    new AuthMiddleware().authorize('ACCESS_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new AuthController(dependencyContainer.get<AuthUserUseCase>('AuthUserUseCase')).logout(
            req,
            res,
            next,
        );
    },
);

router.get(
    '/api/refresh-token',
    new AuthMiddleware().authorize('REFRESH_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new AuthController(dependencyContainer.get<AuthUserUseCase>('AuthUserUseCase')).refreshToken(
            req,
            res,
            next,
        );
    },
);

router.get(
    '/api/tips',
    new AuthMiddleware().authorize('ACCESS_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new ListTipsController(dependencyContainer.get<ListTipsUseCase>('ListTipsUseCase')).tipsList(
            req,
            res,
            next,
        );
    },
);

router.post(
    '/api/tips',
    new AuthMiddleware().authorize('ACCESS_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new createTipsController(dependencyContainer.get<CreateTipsUseCase>('CreateTipsUseCase')).create(
            req,
            res,
            next,
        );
    },
);

router.put(
    '/api/tips/:tipsId',
    new AuthMiddleware().authorize('ACCESS_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new updateTipsController(dependencyContainer.get<UpdateTipsUseCase>('UpdateTipsUseCase')).update(
            req,
            res,
            next,
        );
    },
);

router.post(
    '/api/post',
    new AuthMiddleware().authorize('ACCESS_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new createPostController(dependencyContainer.get<CreatePostUseCase>('CreatePostUseCase')).create(
            req,
            res,
            next,
        );
    },
);

router.delete(
    '/api/tips/:tipsId',
    new AuthMiddleware().authorize('ACCESS_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new DeleteTipsController(dependencyContainer.get<DeleteTipsUseCase>('DeleteTipsUseCase')).delete(
            req,
            res,
            next,
        );
    },
);

router.get('/api/posts', async (req: RequestLogged, res: Response, next: NextFunction) => {
    return await new ListPostsController(dependencyContainer.get<ListPostUseCase>('ListPostUseCase')).postsList(
        req,
        res,
        next,
    );
});

router.get('/api/post/:postId', async (req: RequestLogged, res: Response, next: NextFunction) => {
    return await new GetPostController(dependencyContainer.get<GetPostUseCase>('GetPostUseCase')).getPost(
        req,
        res,
        next,
    );
});

router.post(
    '/api/reaction/post/:postId',
    new AuthMiddleware().authorize('ACCESS_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new ReactionController(
            dependencyContainer.get<ReactionOnPostUseCase>('ReactionOnPostUseCase'),
        ).reactionOnPost(req, res, next);
    },
);

router.get(
    '/api/reaction/post/:postId',
    new AuthMiddleware().authorize('ACCESS_TOKEN'),
    async (req: RequestLogged, res: Response, next: NextFunction) => {
        return await new ReactionController(
            dependencyContainer.get<ReactionOnPostUseCase>('ReactionOnPostUseCase'),
        ).getReactionForCurrentUser(req, res, next);
    },
);

export default router;
