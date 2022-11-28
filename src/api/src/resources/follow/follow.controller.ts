import { NextFunction, Request, Response, Router } from 'express';
import { HTTPCodes } from '@/utils/helpers/response';
import Controller from '@/utils/interfaces/controller.interface';
import FollowService from '@/resources/follow/follow.service';
import authenticatedMiddleware from '@/middlewares/auth.middleware';

class FollowController implements Controller {
  public path = '/follow';
  public router = Router();
  private FollowService = new FollowService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes() {
    this.router.post(
      this.path + '/:username',
      [authenticatedMiddleware],
      this.follow
    );

    this.router.delete(
      this.path + '/:username',
      [authenticatedMiddleware],
      this.unfollow
    );
  }

  private follow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;
      const { username } = req.params;

      const follow = await this.FollowService.follow(user.id, username);

      return res.status(HTTPCodes.CREATED).json({ message: 'Successful' });
    } catch (error) {
      return next(error);
    }
  };

  private unfollow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;
      const { username } = req.params;

      const unfollow = await this.FollowService.unfollow(user.id, username);

      return res.status(HTTPCodes.OK).json({ message: 'Successful' });
    } catch (error) {
      return next(error);
    }
  };
}

export default FollowController;
