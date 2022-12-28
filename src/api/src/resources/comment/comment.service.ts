import HttpException from '@/utils/exceptions/http.exception';
import createError from '@/utils/helpers/createError';
import { PrismaClient } from '@prisma/client';

class CommentService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  public async getComments(postId: string) {
    try {
      const post = await this.db.post.findFirst({
        where: {
          id: postId,
        },
      });

      if (!post) throw createError.NotFound();

      const comments = await this.db.comment.findMany({
        include: {
          author: {
            select: {
              username: true,
              profile: { select: { profilePicUrl: true } },
            },
          },
        },
        where: { postId: postId },
        orderBy: { createdAt: 'desc' },
      });

      return comments;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }

  public async addComment(userId: string, postId: string, content: string) {
    try {
      const post = await this.db.post.findFirst({ where: { id: postId } });

      if (!post) throw createError.NotFound();

      const comment = await this.db.comment.create({
        data: { authorId: userId, postId: postId, content: content },
      });

      return comment;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }

  public async editComment(userId: string, commentId: string, content: string) {
    try {
      const author = await this.db.comment.findFirst({
        select: { authorId: true },
        where: { id: commentId },
      });

      if (!author) throw createError.NotFound();
      else if (author.authorId != userId) throw createError.Forbidden();

      const comment = await this.db.comment.update({
        data: { content: content },
        where: { id: commentId },
      });

      return comment;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }

  public async deleteComment(userId: string, commentId: string) {
    try {
      const author = await this.db.comment.findFirst({
        select: { authorId: true },
        where: { id: commentId },
      });

      if (!author) throw createError.NotFound();
      else if (author.authorId != userId) throw createError.Forbidden();

      const comment = await this.db.comment.delete({
        where: { id: commentId },
      });

      return comment;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }
}

export default CommentService;
