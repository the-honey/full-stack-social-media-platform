import { Request, Response, NextFunction } from 'express';
import token from '@/utils/token';
import Token from '@/utils/interfaces/token.interface';
import createError from '@/utils/helpers/createError';
import jwt from 'jsonwebtoken';
import { db } from '@/utils/db';
import HttpException from '@/utils/exceptions/http.exception';

async function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) throw createError.Unauthorised();

    const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
      accessToken
    );

    if (payload instanceof jwt.JsonWebTokenError) {
      throw createError.Unauthorised();
    }

    const user = await db.user.findFirst({
      select: {
        id: true,
        username: true,
        email: true,
        isEmailVerified: true,
        profileId: true,
      },
      where: { id: payload.id },
    });

    if (!user) throw createError.Unauthorised();

    res.locals.user = user;

    return next();
  } catch (error) {
    return next(createError.Unauthorised());
  }
}

export default authenticatedMiddleware;
