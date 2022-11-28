import { Request, Response, NextFunction } from 'express';
import token from '@/utils/token';
import UserService from '@/resources/user/user.service';
import Token from '@/utils/interfaces/token.interface';
import createError from '@/utils/helpers/createError';
import jwt from 'jsonwebtoken';
import { db } from '@/utils/db';

async function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) return next(createError.Unauthorised());

  try {
    const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
      accessToken
    );

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(createError.Unauthorised());
    }

    const user = await db.user.findFirst({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      return next(createError.Unauthorised());
    }

    res.locals.user = user;

    return next();
  } catch (error) {
    return next(createError.Unauthorised());
  }
}

export default authenticatedMiddleware;
