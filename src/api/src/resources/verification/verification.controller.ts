import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import Controller from '@/utils/interfaces/controller.interface';
import VerificationService from '@/resources/verification/verification.service';
import authenticatedMiddleware from '@/middlewares/auth.middleware';
import { PrismaClient } from '@prisma/client';

class VerificationController implements Controller {
  public path = '/verify';
  public router = Router();
  private VerificationService: VerificationService;

  constructor(db: PrismaClient) {
    this.VerificationService = new VerificationService(db);
    this.initialiseRoutes();
  }

  private initialiseRoutes() {
    this.router.get(this.path + '/:token', this.verify);

    this.router.post(
      this.path,
      [authenticatedMiddleware],
      this.getVerification
    );
  }

  private verify = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { token } = req.params;

      const verify = await this.VerificationService.verify(token);

      return res.status(StatusCodes.OK).json({ message: 'Successful' });
    } catch (error) {
      return next(error);
    }
  };

  private getVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user } = res.locals;

      const verification =
        await this.VerificationService.createEmailVerification(user.id);

      return res
        .status(StatusCodes.OK)
        .json({ message: 'Successful', verification });
    } catch (error) {
      return next(error);
    }
  };
}

export default VerificationController;
