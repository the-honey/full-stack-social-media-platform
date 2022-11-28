import { db } from '@/utils/db';
import HttpException from '@/utils/exceptions/http.exception';
import createError from '@/utils/helpers/createError';

class UserService {
  public async getUser(userId: string): Promise<any> {
    try {
      const user = await db.user.findFirst({
        select: {
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
        where: { OR: [{ id: userId }, { username: userId }] },
      });

      if (!user) throw createError.NotFound();

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw createError.InternalServerError();
    }
  }

  public async getRecommendedUsers(userId: string): Promise<any> {
    try {
      const followingIds = await db.follows.findMany({
        select: { followingId: true },
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
