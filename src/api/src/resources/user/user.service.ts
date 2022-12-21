import HttpException from '@/utils/exceptions/http.exception';
import createError from '@/utils/helpers/createError';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

class UserService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  public async getNewestUsers(userId: string): Promise<any> {
    try {
      const users = await this.db.user.findMany({
        select: {
          id: true,
          username: true,
          profile: true,
        },
        where: { NOT: { id: userId } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      return users;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw createError.InternalServerError();
    }
  }

  public async getUser(username: string): Promise<any> {
    try {
      const user = await this.db.user.findFirst({
        select: {
          id: true,
          username: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              description: true,
              profilePicUrl: true,
              birthDate: true,
            },
          },
        },
        where: { username: username },
      });

      if (!user) throw createError.NotFound();

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw createError.InternalServerError();
    }
  }

  public async editUser(
    profileId: number,
    firstName: string | undefined,
    lastName: string | undefined,
    birthDate: Date | undefined,
    description: string | undefined,
    profilePic: string | undefined
  ): Promise<any> {
    try {
      const profile = await this.db.profile.update({
        data: {
          firstName: firstName,
          lastName: lastName,
          birthDate: birthDate,
          description: description,
          profilePicUrl: profilePic,
        },
        where: { id: profileId },
      });

      if (!profile) throw createError.NotFound();

      return profile;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw error;
    }
  }

  public async getRecommendedUsers(userId: string): Promise<any> {
    try {
      const followingIds = await this.db.follows.findMany({
        where: { followerId: userId },
      });

      const recommended = await this.db.user.findMany({
        select: {
          username: true,
          profile: true,
          _count: { select: { followedBy: true } },
        },
        where: {
          followedBy: {
            some: {
              followerId: {
                in: Array.from(followingIds, (x) => x.followingId),
              },
            },
            none: {
              followerId: userId,
            },
          },
        },
        orderBy: { followedBy: { _count: 'desc' } },
        take: 5,
      });

      return recommended;
    } catch (error) {
      throw createError.InternalServerError();
    }
  }

  public async deleteUser(userId: string): Promise<any> {
    try {
      const user = await this.db.user.delete({
        where: {
          id: userId,
        },
      });

      return user;
    } catch (error) {
      throw createError.InternalServerError();
    }
  }
}

export default UserService;
