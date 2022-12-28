import HttpException from '@/utils/exceptions/http.exception';
import createError from '@/utils/helpers/createError';
import { PrismaClient, ReactionType } from '@prisma/client';

class ReactionService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  public async addReaction(
    userId: string,
    postId: string,
    reactionType: ReactionType = ReactionType.LIKE
  ) {
    try {
      const post = await this.db.post.findFirst({ where: { id: postId } });

      if (!post) throw createError.NotFound();

      const getReaction = await this.db.reaction.findFirst({
        where: { postId: postId, authorId: userId },
      });

      if (getReaction) throw createError.Conflict();

      const reaction = await this.db.reaction.upsert({
        create: { authorId: userId, postId: postId, type: reactionType },
        update: { type: reactionType },
        where: { authorId_postId: { authorId: userId, postId: postId } },
      });

      return reaction;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw error;
    }
  }

  public async removeReaction(userId: string, postId: string) {
    try {
      const reaction = await this.db.reaction.delete({
        where: { authorId_postId: { authorId: userId, postId: postId } },
      });

      if (!reaction) throw createError.NotFound();

      return reaction;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }

  public async getReactions(userId: string, postId: string) {
    try {
      const post = await this.db.post.findFirst({
        include: { _count: { select: { reactions: true } } },
        where: { id: postId },
      });

      const reaction = await this.db.reaction.findFirst({
        where: { authorId: userId, postId: postId },
      });

      if (!post) throw createError.NotFound();

      return { reactions: post._count.reactions, reaction: reaction };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }
}

export default ReactionService;
