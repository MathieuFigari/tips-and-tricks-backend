import debug from 'debug';
import { Response } from 'express';
import { RequestLogged } from '../_common/client-side/types/requestLogged';
const logger = debug('tipsandtricks:errorsHandler');

export default class ErrorsHandler {
    static handle(err: Error, req: RequestLogged, res: Response) {
        if (err['statusCode']) {
            res.status(err['statusCode']).send({
                status: err['statusCode'] ?? '',
                code: err['code'] ?? '',
                message: err.message,
            });
            logger(err.message);
            return;
        }
        logger(err.message);
        res.status(500).send({
            status: 500,
            code: err['code'] ?? '',
            message: 'Server error',
        });
    }
}
