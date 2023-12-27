import { NextFunction, Response } from 'express';
import { RequestLogged } from '../../../_common/client-side/types/requestLogged';
import DeleteTipsUseCase from '../../../tips/domain/use_cases/deleteUseCase';
import InputError from '../../../_common/domain/errors/inputError';

export default class DeleteTipsController {
    constructor(private readonly _deleteTipsUseCase: DeleteTipsUseCase) {}

    /**
     * @openapi
     * tags:
     *   name: Tips
     * /tips/{tipsId}:
     *   delete:
     *     summary: Delete a tips
     *     tags: [Tips]
     *     parameters:
     *       - in: path
     *         name: tipId
     *         required: true
     *         description: ID of the tip to delete
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: Successfully deleted
     *       400:
     *         description: Bad request (e.g., tip not found)
     *       500:
     *         description: Some server errors
     *
     */
    public async delete(req: RequestLogged, res: Response, next: NextFunction) {
        try {
            const tipsId = parseInt(req.params.tipsId);
            const userId = req.user.id;
            if (isNaN(tipsId)) {
                throw new InputError('Delete tips failed !');
            }

            const deletedSuccessfully = await this._deleteTipsUseCase.delete(userId, tipsId);

            if (deletedSuccessfully) {
                return res.status(200).send({
                    message: 'Tips deleted successfully.',
                });
            } else {
                throw new InputError('Delete tips failed !');
            }
        } catch (err) {
            next(err);
        }
    }
}
