import { Router, Request, Response, NextFunction } from 'express';
import { HTTPCodes } from '@/utils/helpers/response';
import Controller from '@/utils/interfaces/controller.interface';
import validationMiddleware from '@/middlewares/validation.middleware';
import validate from '@/resources/auth/auth.validation';
import AuthService from '@/resources/auth/auth.service';

class AuthController implements Controller {
  public path = '/auth';
  public router = Router();
  private AuthService = new AuthService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );

    this.router.post(
      `${this.path}/register`,
      validationMiddleware(validate.register),
      this.register
    );

    this.router.post(`${this.path}/logout`, this.logout);
  }

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { username, password } = req.body;

      const { user, token } = await this.AuthService.login(username, password);

      user.password = undefined;
      user.passwordConfirm = undefined;

      return res
        .cookie('accessToken', token, {
          httpOnly: true,
        })
        .status(HTTPCodes.OK)
        .json({ user, token });
    } catch (error: any) {
      return next(error);
    }
  };

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, username, firstName, lastName, password, birthDate } =
        req.body;

      const { user, accessToken } = await this.AuthService.register(
        email,
        username,
        firstName,
        lastName,
        birthDate,
        password
      );

      return res
        .cookie('accessToken', accessToken, {
          httpOnly: true,
        })
        .status(HTTPCodes.CREATED)
        .json({ message: 'Registered successfully' });
    } catch (error: any) {
      return next(error);
    }
  };

  private logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    return res
      .clearCookie('accessToken', {
        secure: true,
        sameSite: 'none',
      })
      .status(HTTPCodes.OK)
      .json({ message: 'You have been logged out' });
  };
}

export default AuthController;
