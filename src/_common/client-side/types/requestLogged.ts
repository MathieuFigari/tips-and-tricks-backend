import { Request } from 'express';
import User from '../../../user/domain/models/User';
export interface RequestLogged extends Request {
    user?: User;
    email?: string;
}
