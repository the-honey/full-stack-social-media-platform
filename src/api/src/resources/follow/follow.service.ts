import HttpException from '@/utils/exceptions/http.exception';
import createError from '@/utils/helpers/createError';
import { PrismaClient } from '@prisma/client';

class FollowService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  public async isFollowing(userId: string, username: string) {
    try {
      const following = await this.db.user.findFirst({
        where: {
          username: username,
          followedBy: { some: { followerId: userId } },
        },
      });

      return following != null;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }
  public async follow(userId: string, username: string) {
    try {
      const following = await this.db.user.findFirst({
        select: { id: true },
        where: { username: username },
      });

      if (!following) throw createError.NotFound();
      if (following.id == userId)
        throw createError.Conflict('You cannot follow yourself');

      const count = await this.db.follows.count({
        where: { followerId: userId, followingId: following.id },
      });
      if (count != 0) throw createError.Conflict();

      const follow = await this.db.follows.create({
        data: {
          followerId: userId,
          followingId: following.id,
        },
      });

      return follow;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }

  public async unfollow(userId: string, username: string) {
    try {
      const following = await this.db.user.findFirst({
        where: {
          username: username,
          followedBy: { some: { followerId: userId } },
        },
      });

      if (!following) throw createError.NotFound();

      const unfollow = await this.db.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: following.id,
          },
        },
      });

      return unfollow;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }
}

export default FollowService;
