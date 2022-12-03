import { db } from '@/utils/db';
import createError from '@/utils/helpers/createError';
import HttpException from '@/utils/exceptions/http.exception';
import token from '@/utils/token';
import bcrypt from 'bcryptjs';

class AuthService {
  public async login(username: string, password: string): Promise<any> {
    try {
      const user = await db.user.findFirst({
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
      const count = await db.user.count({
        where: {
          OR: [{ username: username }, { email: email }],
        },
      });
      if (count != 0) throw createError.Conflict('User already exists');

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const user = await db.user.create({
        data: {
          username: username,
          email: email,
          password: hashedPassword,
          profile: {
            create: {
              firstName: firstName,
              lastName: lastName,
              brithDate: birthDate,
            },
          },
          //emailVerification: { create: {} },
        },
      });

      const accessToken = token.createToken(user);
      //return { user, token: accessToken, activationToken };
      return { user, accessToken };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }

  // public async confirmMail(token: string): Promise<any> {
  //   const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  //   const user = await this.user.findOne({
  //     activationLink: hashedToken,
  //   });

  //   if (!user) {
  //     throw new Error('Unable to find user with that email address');
  //   }

  //   await user.save();

  //   return user;
  // }

  // public async updatePassword(
  //   email: string,
  //   password: string,
  //   passwordConfirm: string
  // ): Promise<any> {
  //   const user = await this.user.findOne({ email });

  //   if (!user) {
  //     throw new Error('Unable to find user with that email address');
  //   }

  //   user.password = password;
  //   user.passwordConfirm = passwordConfirm;

  //   await user.save();

  //   return user;
  // }

  // public async forgotPassword(email: string): Promise<any> {
  //   const user = await this.user.findOne({ email });

  //   if (!user) {
  //     throw new Error('Unable to find user with that email address');
  //   }

  //   const resetToken = user.createPasswordResetToken();

  //   await user.save();

  //   return resetToken;
  // }

  // public async resetPassword(
  //   token: string,
  //   password: string,
  //   passwordConfirm: string
  // ): Promise<any> {
  //   const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  //   const user = await this.user.findOne({
  //     passwordResetToken: hashedToken,
  //   });

  //   if (!user) {
  //     throw new Error('Unable to find user with that email address');
  //   }

  //   user.password = password;
  //   user.passwordConfirm = passwordConfirm;

  //   await user.save();

  //   return user;
  // }
}

export default AuthService;
