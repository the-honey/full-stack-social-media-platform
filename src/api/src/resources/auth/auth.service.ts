import createError from '@/utils/helpers/createError';
import HttpException from '@/utils/exceptions/http.exception';
import token from '@/utils/token';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

class AuthService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  public async login(username: string, password: string): Promise<any> {
    try {
      const user = await this.db.user.findFirst({
        include: { profile: true },
        where: { username: username },
      });

      if (!user || !bcrypt.compareSync(password, user?.password))
        throw createError.Forbidden('Incorrect username or password');

      return { token: token.createToken(user), user };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }

  public async register(
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    birthDate: Date,
    password: string
  ): Promise<any> {
    try {
      const count = await this.db.user.count({
        where: {
          OR: [{ username: username }, { email: email }],
        },
      });
      if (count != 0) throw createError.Conflict('User already exists');

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const user = await this.db.user.create({
        data: {
          username: username,
          email: email,
          password: hashedPassword,
          isEmailVerified: true,
          profile: {
            create: {
              firstName: firstName,
              lastName: lastName,
              birthDate: birthDate,
            },
          },
          //emailVerification: { create: {} },
        },
      });

      const accessToken = token.createToken(user);
      return { user, accessToken };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }
}

export default AuthService;
