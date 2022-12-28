import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import Controller from '@/utils/interfaces/controller.interface';
import ReactionService from '@/resources/reaction/reaction.service';
import authenticatedMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import validation from '@/resources/reaction/reaction.validation';
import verifiedMiddleware from '@/middlewares/verified.middleware';
import { PrismaClient } from '@prisma/client';

class ReactionController implements Controller {
  public path = '/reaction/:postId';
  public router = Router();
  private ReactionService: ReactionService;

  constructor(db: PrismaClient) {
    this.ReactionService = new ReactionService(db);
    this.initialiseRoutes();
  }

  private initialiseRoutes() {
    this.router.post(
      this.path,
      [authenticatedMiddleware, verifiedMiddleware()],
      this.addReaction
    );

    this.router.delete(
      this.path,
      [authenticatedMiddleware, verifiedMiddleware()],
      this.removeReaction
    );

    this.router.get(this.path, [authenticatedMiddleware], this.getReactions);
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

      return res
        .status(StatusCodes.CREATED)
        .json({ message: 'Successful', reaction });
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

      return res.status(StatusCodes.OK).json({ message: 'Successful' });
    } catch (error) {
      return next(error);
    }
  };

  private getReactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;
      const { postId } = req.params;

      const reactions = await this.ReactionService.getReactions(
        user.id,
        postId
      );

      return res.status(StatusCodes.OK).json({
        message: 'Successful',
        reactionCount: reactions.reactions,
        userReaction: reactions.reaction,
      });
    } catch (error) {
      return next(error);
    }
  };
}

export default ReactionController;
