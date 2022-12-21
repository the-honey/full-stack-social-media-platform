import HttpException from '@/utils/exceptions/http.exception';
import createError from '@/utils/helpers/createError';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

class VerificationService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  public async verify(token: string) {
    try {
      const verification = await this.db.emailVerification.findFirst({
        where: { token: token },
      });

      if (
        !verification ||
        dayjs(verification.createdAt).add(30, 'minutes') < dayjs()
      )
        throw createError.BadRequest('Invalid verification token');

      const user = await this.db.user.update({
        data: { isEmailVerified: true },
        where: { id: verification.userId },
      });

      const deleteVerification = await this.db.emailVerification.delete({
        where: { token: token },
      });

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }

  public async createEmailVerification(userId: string) {
    try {
      const isVerified = await this.db.user.findFirst({
        where: { id: userId, isEmailVerified: true },
      });
      if (isVerified) throw createError.Conflict('Already verified');

      const verification = await this.db.emailVerification.create({
        data: { userId: userId },
      });

      return verification;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }
}

export default VerificationService;
