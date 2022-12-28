import createError from '@/utils/helpers/createError';
import HttpException from '@/utils/exceptions/http.exception';
import { PrismaClient } from '@prisma/client';

class PostService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  public async getPosts(username: string) {
    try {
      const user = await this.db.user.findFirst({
        select: {
          posts: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  profile: { select: { profilePicUrl: true } },
                },
              },
              media: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
        where: { username: username },
      });

      if (!user) throw createError.NotFound();

      return user.posts;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw createError.InternalServerError();
    }
  }
  public async getFeed(userId: string) {
    try {
      const following = await this.db.follows.findMany({
        select: { following: { select: { id: true } } },
        where: { followerId: userId },
      });

      const posts = await this.db.post.findMany({
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
          },
          /*,
          _count: {
            select: { reactions: true },
          },
          reactions: { include: {author: {select:{_count:{select:{reactions:true}}}}},where: {} },*/
        },
        orderBy: { createdAt: 'desc' },
      });

      const reactions = await this.db.reaction.count({
        where: { authorId: { in: posts.map((post) => post.id) } },
      });

      return posts;
    } catch (error) {
      throw createError.InternalServerError();
    }
  }

  public async createPost(userId: string, content: string) {
    try {
      const post = await this.db.post.create({
        data: { content: content, authorId: userId },
        select: { id: true, content: true, createdAt: true },
      });

      return post;
    } catch (error) {
      throw createError.InternalServerError();
    }
  }

  public async createPostV2(
    userId: string,
    content: string,
    filename: string | undefined
  ) {
    try {
      let post;

      if (filename) {
        post = await this.db.post.create({
          data: {
            content: content,
            authorId: userId,
            media: { create: { mediaUrl: filename, type: 'IMAGE' } },
          },
          select: { id: true, content: true, createdAt: true },
        });
      } else {
        post = await this.db.post.create({
          data: {
            content: content,
            authorId: userId,
          },
          select: { id: true, content: true, createdAt: true },
        });
      }

      return post;
    } catch (error) {
      throw createError.InternalServerError();
    }
  }

  public async deletePost(userId: string, postId: string) {
    try {
      const post = await this.db.post.findFirst({ where: { id: postId } });

      if (!post) throw createError.NotFound();
      else if (post.authorId != userId) throw createError.Forbidden();

      const deleted = await this.db.post.delete({
        where: {
          id: postId,
        },
      });

      return deleted;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw error;
    }
  }

  public async editPost(userId: string, postId: string, content: string) {
    try {
      const author = await this.db.post.findFirst({
        where: { authorId: userId, id: postId },
      });

      if (!author) throw createError.NotFound();
      else if (author.authorId != userId) throw createError.Forbidden();

      const post = await this.db.post.update({
        data: { content: content },
        where: { id: postId },
      });

      return post;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw error;
    }
  }
}

export default PostService;
