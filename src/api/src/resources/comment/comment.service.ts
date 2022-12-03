import { db } from '@/utils/db';
import HttpException from '@/utils/exceptions/http.exception';
import createError from '@/utils/helpers/createError';

class CommentService {
  public async getComments(postId: string) {
    try {
      const comments = await db.comment.findMany({
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
      throw createError.InternalServerError();
    }
  }

  public async addComment(userId: string, postId: string, content: string) {
    try {
      const comment = await db.comment.create({
        data: { authorId: userId, postId: postId, content: content },
      });

      return comment;
    } catch (error) {
      throw createError.InternalServerError();
    }
  }

  public async editComment(userId: string, commentId: string, content: string) {
    try {
      const author = await db.comment.findFirst({
        select: { authorId: true },
        where: { id: commentId },
      });

      if (!author) throw createError.NotFound();
      else if (author.authorId != userId) throw createError.Forbidden();

      const comment = await db.comment.update({
        data: { content: content },
        where: { id: commentId },
      });

      console.log(comment);

      return comment;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }

  public async deleteComment(userId: string, commentId: string) {
    try {
      const author = await db.comment.findFirst({
        select: { authorId: true },
        where: { id: commentId },
      });

      if (!author) throw createError.NotFound();
      else if (author.authorId != userId) throw createError.Forbidden();

      const comment = await db.comment.delete({
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
