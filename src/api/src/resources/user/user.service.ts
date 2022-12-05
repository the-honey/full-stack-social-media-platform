import { db } from '@/utils/db';
import HttpException from '@/utils/exceptions/http.exception';
import createError from '@/utils/helpers/createError';

class UserService {
  public async getNewestUsers(userId: string): Promise<any> {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          username: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              description: true,
              profilePicUrl: true,
            },
          },
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
      const user = await db.user.findFirst({
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
    firstName: string,
    lastName: string,
    birthDate: Date,
    description: string
  ): Promise<any> {
    try {
      const profile = await db.profile.update({
        data: {
          firstName: firstName,
          lastName: lastName,
          birthDate: birthDate,
          description,
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
      const followingIds = await db.follows.findMany({
        where: { followerId: userId },
      });

      const recommended = await db.user.findMany({
        select: { username: true, _count: { select: { followedBy: true } } },
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
      const user = await db.user.delete({
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
