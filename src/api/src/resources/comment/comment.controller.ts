import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import Controller from '@/utils/interfaces/controller.interface';
import CommentService from '@/resources/comment/comment.service';
import authenticatedMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import validation from '@/resources/comment/comment.validation';
import verifiedMiddleware from '@/middlewares/verified.middleware';
import { PrismaClient } from '@prisma/client';

class CommentController implements Controller {
  public path = '/comment';
  public router = Router();
  private CommentService: CommentService;

  constructor(db: PrismaClient) {
    this.CommentService = new CommentService(db);
    this.initialiseRoutes();
  }

  private initialiseRoutes() {
    this.router.get(this.path + '/:postId', this.getComments);

    this.router.post(
      this.path + '/:postId',
      [
        authenticatedMiddleware,
        verifiedMiddleware(),
        validationMiddleware(validation.addComment),
      ],
      this.addComment
    );

    this.router.patch(
      this.path + '/:commentId',
      [
        authenticatedMiddleware,
        verifiedMiddleware(),
        validationMiddleware(validation.editComment),
      ],
      this.editComment
    );

    this.router.delete(
      this.path + '/:commentId',
      [authenticatedMiddleware, verifiedMiddleware()],
      this.deleteComment
    );
  }

  private getComments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { postId } = req.params;

      const comments = await this.CommentService.getComments(postId);

      return res
        .status(StatusCodes.CREATED)
        .json({ message: 'Successful', comments });
    } catch (error) {
      return next(error);
    }
  };

  private addComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;
      const { postId } = req.params;
      const { content } = req.body;

      console.log(user);

      const comment = await this.CommentService.addComment(
        user.id,
        postId,
        content
      );

      return res
        .status(StatusCodes.CREATED)
        .json({ message: 'Successful', comment });
    } catch (error) {
      return next(error);
    }
  };

  private editComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;
      const { commentId } = req.params;
      const { content } = req.body;

      const comment = await this.CommentService.editComment(
        user.id,
        commentId,
        content
      );

      return res
        .status(StatusCodes.OK)
        .json({ message: 'Successful', comment });
    } catch (error) {
      return next(error);
    }
  };

  private deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals.user;
      const { commentId } = req.params;

      await this.CommentService.deleteComment(user.id, commentId);

      return res.status(StatusCodes.OK).json({ message: 'Successful' });
    } catch (error) {
      return next(error);
    }
  };
}

export default CommentController;
