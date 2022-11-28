import { Router, Request, Response, NextFunction } from 'express';
import { HTTPCodes } from '@/utils/helpers/response';
import Controller from '@/utils/interfaces/controller.interface';
import validationMiddleware from '@/middlewares/validation.middleware';
import validate from '@/resources/auth/auth.validation';
import UserService from '@/resources/user/user.service';
import AuthService from '@/resources/auth/auth.service';

class AuthController implements Controller {
  public path = '/auth';
  public router = Router();
  private UserService = new UserService();
  private AuthService = new AuthService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    // this.router.get(`${this.path}`, authenticated, this.getUsers);

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

    //this.router.get(`${this.path}/confirmMail/:token`, this.confirmMail);
    //this.router.patch(`${this.path}/update-password`, this.updatePassword);
    // this.router.patch(`${this.path}/forgot-password`, this.forgotPassword);
    // this.router.patch(`${this.path}/reset-password`, this.forgotPassword);
    // this.router.patch(`${this.path}/-password`, this.forgotPassword);
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

  // private confirmMail = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response | void> => {
  //   try {
  //     const { token } = req.params;

  //     const user = await this.AuthService.confirmMail(token);

  //     user.active = true;
  //     user.activationLink = undefined;

  //     res.status(HTTPCodes.OK).json({ user });
  //   } catch (error: any) {
  //     next(new HttpException(HTTPCodes.BAD_REQUEST, error.message));
  //   }
  // };

  // private updatePassword = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response | void> => {
  //   try {
  //     const { password, passwordConfirm } = req.body;

  //     const user = await this.AuthService.updatePassword(
  //       res.locals.email,
  //       password,
  //       passwordConfirm
  //     );

  //     user.password = undefined;
  //     user.passwordConfirm = undefined;

  //     res.status(HTTPCodes.OK).json({ user });
  //   } catch (error: any) {
  //     next(new HttpException(HTTPCodes.BAD_REQUEST, error.message));
  //   }
  // };

  // private forgotPassword = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response | void> => {
  //   try {
  //     const { email } = req.body;

  //     const user = await this.AuthService.forgotPassword(email);

  //     user.password = undefined;
  //     user.passwordConfirm = undefined;

  //     res.status(HTTPCodes.OK).json({ user });
  //   } catch (error: any) {
  //     next(new HttpException(HTTPCodes.BAD_REQUEST, error.message));
  //   }
  // };

  // private resetPassword = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response | void> => {
  //   try {
  //     const { email, password, passwordConfirm } = req.body;

  //     const user = await this.AuthService.resetPassword(
  //       email,
  //       password,
  //       passwordConfirm
  //     );

  //     user.password = undefined;
  //     user.passwordConfirm = undefined;

  //     res.status(HTTPCodes.OK).json({ user });
  //   } catch (error: any) {
  //     next(new HttpException(HTTPCodes.BAD_REQUEST, error.message));
  //   }
  // };
}

export default AuthController;
