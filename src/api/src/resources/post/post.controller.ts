import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import Controller from '@/utils/interfaces/controller.interface';
import PostService from '@/resources/post/post.service';
import authenticatedMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import validation from '@/resources/post/post.validation';
import verifiedMiddleware from '@/middlewares/verified.middleware';
import { uploadMiddleware } from '@/middlewares/upload.middleware';
import { PrismaClient } from '@prisma/client';

class PostController implements Controller {
  public path = '/post';
  public router = Router();
  private PostService: PostService;

  constructor(db: PrismaClient) {
    this.PostService = new PostService(db);
    this.initialiseRoutes();
  }

  private initialiseRoutes() {
    this.router.get(
      this.path + '/:username',
      authenticatedMiddleware,
      this.getPosts
    );

    this.router.get(this.path, authenticatedMiddleware, this.getFeed);

    this.router.post(
      this.path,
      [
        authenticatedMiddleware,
        verifiedMiddleware(),
        uploadMiddleware,
        validationMiddleware(validation.createPost),
      ],
      this.createPost
    );

    this.router.delete(
      this.path + '/:postId',
      [authenticatedMiddleware, verifiedMiddleware()],
      this.deletePost
    );

    this.router.patch(
      this.path + '/:postId',
      [
        authenticatedMiddleware,
        verifiedMiddleware(),
        validationMiddleware(validation.editPost),
      ],
      this.editPost
    );
  }

  private getFeed = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;

      const posts = await this.PostService.getFeed(user.id);

      return res.status(StatusCodes.OK).json({ message: 'Successful', posts });
    } catch (error) {
      return next(error);
    }
  };

  private getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { username } = req.params;

      const posts = await this.PostService.getPosts(username);

      return res.status(StatusCodes.OK).json({ message: 'Successful', posts });
    } catch (error) {
      return next(error);
    }
  };

  private createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;
      const { content } = req.body;
      const { file } = req;

      const post = await this.PostService.createPostV2(
        user.id,
        content,
        file?.filename
      );

      return res
        .status(StatusCodes.CREATED)
        .json({ message: 'Successful', file, content });
    } catch (error) {
      next(error);
    }
  };

  private deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;
      const { postId } = req.params;

      const post = await this.PostService.deletePost(user.id, postId);

      return res.status(StatusCodes.OK).json({ message: 'Successful', post });
    } catch (error) {
      return next(error);
    }
  };

  private editPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;
      const { postId } = req.params;
      const { content } = req.body;

      const post = await this.PostService.editPost(user.id, postId, content);
      return res
        .status(StatusCodes.CREATED)
        .json({ message: 'Successful', post });
    } catch (error) {
      return next(error);
    }
  };
}

export default PostController;
