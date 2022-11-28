import Controller from '@/utils/interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';
import ReactionService from '@/resources/reaction/reaction.service';
import authenticatedMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import validation from '@/resources/reaction/reaction.validation';
import { HTTPCodes } from '@/utils/helpers/response';

class ReactionController implements Controller {
  public path = '/reaction/:postId';
  public router = Router();
  private ReactionService = new ReactionService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes() {
    this.router.post(
      this.path,
      [authenticatedMiddleware, validationMiddleware(validation.addReaction)],
      this.addReaction
    );

    this.router.delete(
      this.path,
      [authenticatedMiddleware],
      this.removeReaction
    );
  }

  private addReaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;
      const { postId } = req.params;
      const { reactionType } = req.body;

      const reaction = await this.ReactionService.addReaction(
        user.id,
        postId,
        reactionType
      );

      return res.status(HTTPCodes.OK).json({ message: 'Successful', reaction });
    } catch (error) {
      return next(error);
    }
  };

  private removeReaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;
      const { postId } = req.params;

      await this.ReactionService.removeReaction(user.id, postId);

      return res.status(HTTPCodes.OK).json({ message: 'Successful' });
    } catch (error) {
      return next(error);
    }
  };
}

export default ReactionController;
