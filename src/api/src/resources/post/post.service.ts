import { NextFunction, Request, Response } from 'express';
import { db } from '@/utils/db';
import jwt from 'jsonwebtoken';
import createError from '@/utils/helpers/createError';

class PostService {
  public async getPosts(userId: string) {
    try {
      const following = await db.follows.findMany({
        select: { following: { select: { id: true } } },
        where: { followerId: userId },
      });

      const posts = await db.post.findMany({
        where: {
          authorId: {
            in: [userId, ...following.map((user) => user.following.id)],
          },
        },
        include: {
          media: true,
          author: {
            select: {
              id: true,
              username: true,
              profile: { select: { profilePicUrl: true } },
            },
          } /*,
          _count: {
            select: { reactions: true },
          },
          reactions: { include: {author: {select:{_count:{select:{reactions:true}}}}},where: {} },*/,
        },
        orderBy: { createdAt: 'desc' },
      });

      const reactions = await db.reaction.count({
        where: { authorId: { in: posts.map((post) => post.id) } },
      });

      return posts;
    } catch (error) {
      throw createError.InternalServerError();
    }
  }

  public async createPost(userId: string, content: string) {
    try {
      const post = await db.post.create({
        data: { content: content, authorId: userId },
        select: { id: true, content: true, createdAt: true },
      });

      return post;
    } catch (error) {
      throw createError.InternalServerError();
    }
  }

  public async deletePost(userId: string, postId: string) {
    try {
      const post = await db.post.findFirst({ where: { id: postId } });

      if (!post) throw createError.NotFound();
      else if (post.authorId != userId) throw createError.Forbidden();

      const deleted = await db.post.delete({
        where: {
          id: postId,
        },
      });

      return deleted;
    } catch (error) {
      throw createError.InternalServerError();
    }
  }

  public async editPost(userId: string, postId: string, content: string) {
    try {
      const author = await db.post.findFirst({
        where: { authorId: userId, id: postId },
      });

      if (!author) throw createError.NotFound();
      else if (author.authorId != userId) throw createError.Forbidden();

      const post = await db.post.update({
        data: { content: content },
        where: { id: postId },
      });

      return post;
    } catch (error) {
      throw error;
    }
  }
}

export default PostService;
