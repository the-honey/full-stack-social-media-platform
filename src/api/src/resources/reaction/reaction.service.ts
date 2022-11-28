import { db } from '@/utils/db';
import HttpException from '@/utils/exceptions/http.exception';
import createError from '@/utils/helpers/createError';
import { ReactionType } from '@prisma/client';

class ReactionService {
  public async addReaction(
    userId: string,
    postId: string,
    reactionType: ReactionType
  ) {
    try {
      const reaction = await db.reaction.upsert({
        create: { authorId: userId, postId: postId, type: reactionType },
        update: { type: reactionType },
        where: { authorId_postId: { authorId: userId, postId: postId } },
      });

      return reaction;
    } catch (error) {
      throw error;
    }
  }

  public async removeReaction(userId: string, postId: string) {
    try {
      const reaction = await db.reaction.deleteMany({
        where: { authorId: userId, postId: postId },
      });

      if (reaction.count != 0) return reaction;

      throw createError.NotFound();
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }
}

export default ReactionService;
