import { db } from '@/utils/db';
import HttpException from '@/utils/exceptions/http.exception';
import createError from '@/utils/helpers/createError';

class FollowService {
  public async follow(userId: string, username: string) {
    try {
      const following = await db.user.findFirst({
        select: { id: true },
        where: { username: username },
      });

      if (!following) throw createError.NotFound();

      const count = await db.follows.count({
        where: { followerId: userId, followingId: following.id },
      });
      if (count != 0) throw createError.Conflict();

      const follow = await db.follows.create({
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
      const following = await db.user.findFirst({
        where: {
          username: username,
          followedBy: { some: { followerId: userId } },
        },
      });

      console.log(JSON.stringify(following));

      if (!following) throw createError.NotFound();

      const unfollow = await db.follows.delete({
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
