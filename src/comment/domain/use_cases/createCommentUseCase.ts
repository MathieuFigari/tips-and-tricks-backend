import * as dotenv from 'dotenv';
import InputError from '../../../_common/domain/errors/inputError';
import InputCreateComment from '../model/inputCreateComment';
import { CommentFullData } from '../model/comment';
import CommentRepositoryInterface from '../port/commentRepositoryInterface';
dotenv.config();

export interface CreateCommentRepositoryInterface {
    create(input: InputCreateComment, userName: string): Promise<CommentFullData>;
}

export default class CreateCommentUseCase implements CreateCommentRepositoryInterface {
    constructor(private readonly _commentRepository: CommentRepositoryInterface) {}

    async create(input: InputCreateComment, userName: string): Promise<CommentFullData> {
        const newComment = await this._commentRepository.create(input, userName);
        if (!newComment) {
            throw new InputError('Create comment failed !');
        }

        return {
            ...newComment,
            username: userName,
        };
    }
}
