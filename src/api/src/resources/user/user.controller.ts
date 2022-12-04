import Controller from '@/utils/interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';
import UserService from '@/resources/user/user.service';
import authenticatedMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import validation from '@/resources/user/user.validation';
import { HTTPCodes } from '@/utils/helpers/response';

class UserController implements Controller {
  public path = '/user';
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes() {
    this.router.get(
      this.path + '/id/:username',
      [authenticatedMiddleware],
      this.getUser
    );

    this.router.patch(
      this.path,
      [authenticatedMiddleware, validationMiddleware(validation.editUser)],
      this.editUser
    );

    this.router.get(
      this.path + '/recommended',
      [authenticatedMiddleware],
      this.getRecommendedUsers
    );

    this.router.get(
      this.path + '/newest',
      [authenticatedMiddleware],
      this.getNewestUsers
    );
  }

  private getNewestUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;

      const users = await this.UserService.getNewestUsers(user.id);
      return res.status(HTTPCodes.OK).json({ message: 'Successful', users });
    } catch (error) {
      return next(error);
    }
  };

  private getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { username } = req.params;

      const user = await this.UserService.getUser(username);
      return res.status(HTTPCodes.OK).json({ message: 'Successful', user });
    } catch (error) {
      return next(error);
    }
  };

  private editUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { profileId } = res.locals.user;
      const { firstName, lastName, description, birthDate } = req.body;

      const user = await this.UserService.editUser(
        profileId,
        firstName,
        lastName,
        birthDate,
        description
      );

      return res.status(HTTPCodes.OK).json({ message: 'Successful', user });
    } catch (error) {
      return next(error);
    }
  };

  private getRecommendedUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;

      const users = await this.UserService.getRecommendedUsers(user.id);

      return res.status(HTTPCodes.OK).json({ message: 'Successful', users });
    } catch (error) {
      return next(error);
    }
  };
}

export default UserController;
