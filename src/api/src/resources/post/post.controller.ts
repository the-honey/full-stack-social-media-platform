import { NextFunction, Request, Response, Router } from 'express';
import { HTTPCodes } from '@/utils/helpers/response';
import Controller from '@/utils/interfaces/controller.interface';
import PostService from '@/resources/post/post.service';
import authenticatedMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import validation from '@/resources/post/post.validation';
import verifiedMiddleware from '@/middlewares/verified.middleware';

class PostController implements Controller {
  public path = '/post';
  public router = Router();
  private PostService = new PostService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes() {
    this.router.get(this.path, authenticatedMiddleware, this.getPosts);

    this.router.post(
      this.path,
      [
        authenticatedMiddleware,
        verifiedMiddleware(),
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

  private getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;

      const posts = await this.PostService.getPosts(user.id);

      return res.status(HTTPCodes.OK).json({ message: 'Successful', posts });
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

      const post = await this.PostService.createPost(user.id, content);

      return res
        .status(HTTPCodes.CREATED)
        .json({ message: 'Successful', post });
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
      const { postId } = req.params;

      const post = await this.PostService.deletePost(postId);

      return res.status(HTTPCodes.OK).json({ message: 'Successful', post });
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
        .status(HTTPCodes.CREATED)
        .json({ message: 'Successful', post });
    } catch (error) {
      return next(error);
    }
  };
}

export default PostController;
