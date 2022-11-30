import createError from '@/utils/helpers/createError';
import { Request, Response, NextFunction, RequestHandler } from 'express';

function verifiedMiddleware(): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { user } = res.locals;

    if (!user.isEmailVerified)
      return next(createError.Unauthorised('You must verify your email'));

    next();
  };
}

export default verifiedMiddleware;
