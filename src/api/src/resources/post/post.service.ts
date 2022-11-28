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
          authorId: { in: following.map((user) => user.following.id) },
        },
        select: {
          content: true,
          createdAt: true,
          updatedAt: true,
          media: true,
          author: {
            select: {
              username: true,
              profile: { select: { profilePicUrl: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
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

  public async deletePost(postId: string) {
    try {
      const post = await db.post.delete({
        where: {
          id: postId,
        },
      });

      return post;
    } catch (error) {
      throw createError.InternalServerError();
    }
  }

  public async editPost(userId: string, postId: string, content: string) {
    try {
      const author = await db.post.findFirst({
        select: { authorId: true },
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
