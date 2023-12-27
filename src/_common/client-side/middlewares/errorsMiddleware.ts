import { NextFunction, Response } from 'express';
import ErrorsHandler from '../../../_handlers/errorsHandler';
import { RequestLogged } from '../types/requestLogged';

export const errorsMiddleware = (err: Error, req: RequestLogged, res: Response, next: NextFunction) => {
    ErrorsHandler.handle(err, req, res);
    next();
};
