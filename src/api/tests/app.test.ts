import request from 'supertest';
import App from '@/app';
import { StatusCodes } from 'http-status-codes';
import { prismaMock } from './prismaMock';
import { Request, Response, NextFunction } from 'express';
import {
  loginInput,
  user,
  registerInput,
  post,
  reaction,
  comment,
  profile,
  follow,
} from './data';
import createError from '@/utils/helpers/createError';
import bcrypt from 'bcryptjs';
// import authenticatedMiddleware from '@/middlewares/auth.middleware';

// const mockMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const { user } = req.body;
//   if (!user) throw createError.Unauthorised();
//   res.locals.user = user;
//   next();
// };

// jest.mock('@/middlewares/auth.middleware', () => {
//   return {
//     default: jest.fn(mockMiddleware),
//   };
// });

jest.mock('@/middlewares/auth.middleware', () =>
  jest.fn((req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) throw createError.Unauthorised();
    res.locals.user = user;
    return next();
  })
);

const app = new App(prismaMock);

describe('POST /auth/register', () => {
  const endpoint = '/api/auth/register';

  test('empty body', async () => {
    const response = await request(app.express).post(endpoint).send({});

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test('email validation', async () => {
    // invalid email
    const response = await request(app.express)
      .post(endpoint)
      .send({ ...registerInput, email: 'invalidemail' });

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test('username validation', async () => {
    // too short username
    const response1 = await request(app.express)
      .post(endpoint)
      .send({ ...registerInput, username: 'a' });

    // too long username
    const response2 = await request(app.express)
      .post(endpoint)
      .send({ ...registerInput, username: 'asdasdasdasdasdasd' });

    // contains special characters
    const response3 = await request(app.express)
      .post(endpoint)
      .send({ ...registerInput, username: 'ááááááá' });

    expect(response1.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response2.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response3.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test('password validation', async () => {
    // short password
    const response1 = await request(app.express)
      .post(endpoint)
      .send({ ...registerInput, password: 'a', confirmPassword: 'a' });

    // long password
    const response2 = await request(app.express)
      .post(endpoint)
      .send({
        ...registerInput,
        password: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        confirmPassword: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      });

    // passwords don't match
    const response3 = await request(app.express)
      .post(endpoint)
      .send({
        ...registerInput,
        password: 'aaaaaaaa',
        confirmPassword: 'bbbbbbbb',
      });

    expect(response1.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response2.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response3.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test('birthDate validation', async () => {
    // invalid date
    const response = await request(app.express)
      .post(endpoint)
      .send({
        ...registerInput,
        birthDate: 'asd',
      });

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test("create an account that doesn't exist yet", async () => {
    prismaMock.user.count.mockResolvedValue(0);
    prismaMock.user.create.mockResolvedValue(user);

    const response = await request(app.express)
      .post(endpoint)
      .send(registerInput);

    expect(response.statusCode).toBe(StatusCodes.CREATED);
  });

  test('create an account that already exists', async () => {
    prismaMock.user.count.mockResolvedValue(1);
    prismaMock.user.create.mockResolvedValue(user);

    const response = await request(app.express)
      .post(endpoint)
      .send(registerInput);

    expect(response.statusCode).toBe(StatusCodes.CONFLICT);
  });
});

describe('POST /auth/login', () => {
  const endpoint = '/api/auth/login';

  test('empty body', async () => {
    const response = await request(app.express).post(endpoint).send({});

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test('username validation', async () => {
    // short username
    const response = await request(app.express)
      .post(endpoint)
      .send({ ...loginInput, username: 'a' });

    // long username
    const response1 = await request(app.express)
      .post(endpoint)
      .send({ ...loginInput, username: 'aaaaaaaaaaaaaaaaa' });

    // special characters in username
    const response2 = await request(app.express)
      .post(endpoint)
      .send({ ...loginInput, username: 'áááááááá' });

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response1.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response2.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test('password validation', async () => {
    // short password
    const response1 = await request(app.express)
      .post(endpoint)
      .send({ ...loginInput, password: 'a' });

    // long password
    const response2 = await request(app.express)
      .post(endpoint)
      .send({
        ...registerInput,
        password: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      });

    expect(response1.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response2.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test('incorrect username or password', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const response = await request(app.express).post(endpoint).send(loginInput);

    expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
  });

  test('successful login', async () => {
    prismaMock.user.findFirst.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compareSync').mockImplementation((pass, hash) => true);

    const response = await request(app.express)
      .post(endpoint)
      .send({ ...loginInput });

    expect(response.statusCode).toBe(StatusCodes.OK);
  });
});

describe('POST /auth/logout', () => {
  const endpoint = '/api/auth/logout';

  test('successful logout', async () => {
    const response = await request(app.express)
      .post(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(response.get('set-cookie'))).not.toMatch(
      /^accessToken=.+/
    );
  });
});

describe('POST /post/', () => {
  const endpoint = '/api/post/';

  test('empty body', async () => {
    const response = await request(app.express)
      .post(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test('create post without authentication', async () => {
    const response = await request(app.express)
      .post(endpoint)
      .send({ content: 'this is a post' });

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('create a post with authentication', async () => {
    prismaMock.post.create.mockResolvedValue(post);

    const response = await request(app.express)
      .post(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ content: 'this is a post' });

    expect(response.statusCode).toBe(StatusCodes.CREATED);
  });
});

describe('GET /post/', () => {
  const endpoint = '/api/post/';

  test('get post without authentication', async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      ...user,
      posts: [] as any,
    });

    const response = await request(app.express)
      .get(endpoint + 'username')
      .send();

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('get feed', async () => {
    prismaMock.follows.findMany.mockResolvedValue([]);
    prismaMock.post.findMany.mockResolvedValue([]);
    prismaMock.reaction.count.mockResolvedValue(0);

    const response = await request(app.express)
      .get(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.OK);
  });

  test("get user's posts", async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      ...user,
      posts: [] as any,
    });

    const response = await request(app.express)
      .get(endpoint + 'username')
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.OK);
  });

  test("get non existent user's posts", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const response = await request(app.express)
      .get(endpoint + 'username')
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('DELETE /post/', () => {
  const endpoint = '/api/post/1';

  test('delete post without authentication', async () => {
    prismaMock.post.delete.mockResolvedValue(post);

    const response = await request(app.express).delete(endpoint).send();

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('delete non existing post', async () => {
    prismaMock.post.findFirst.mockResolvedValue(null);

    const response = await request(app.express)
      .delete(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test('delete a post not owned by the user', async () => {
    prismaMock.post.findFirst.mockResolvedValue({ ...post, authorId: '2' });

    const response = await request(app.express)
      .delete(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
  });

  test('delete a post owned by the user', async () => {
    prismaMock.post.findFirst.mockResolvedValue(post);

    const response = await request(app.express)
      .delete(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.OK);
  });
});

describe('PATCH /post/', () => {
  const endpoint = '/api/post/1';

  test('edit post without authentication', async () => {
    const response = await request(app.express)
      .patch(endpoint)
      .send({ content: 'edited post text' });

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('edit non existing post', async () => {
    prismaMock.post.findFirst.mockResolvedValue(null);

    const response = await request(app.express)
      .patch(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ content: 'edited post text' });

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test('edit a post not owned by the user', async () => {
    prismaMock.post.findFirst.mockResolvedValue({ ...post, authorId: '2' });

    const response = await request(app.express)
      .patch(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ content: 'edited post text' });

    expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
  });

  test('edit a post owned by the user', async () => {
    prismaMock.post.findFirst.mockResolvedValue(post);

    const response = await request(app.express)
      .patch(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ content: 'edited post text' });

    expect(response.statusCode).toBe(StatusCodes.OK);
  });
});

describe('GET /reaction/', () => {
  const endpoint = '/api/reaction/1';

  test('get reactions from a post without authentication', async () => {
    const response = await request(app.express).get(endpoint).send();

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('get reactions from a non existing post', async () => {
    prismaMock.post.findFirst.mockResolvedValue(null);

    const response = await request(app.express)
      .get(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("get reactions from an existing post that the user didn't reacted to", async () => {
    prismaMock.post.findFirst.mockResolvedValue({
      ...post,
      _count: { reactions: 10 },
    } as any);
    prismaMock.reaction.findFirst.mockResolvedValue(null);

    const response = await request(app.express)
      .get(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.body.reactionCount).toBe(10);
    expect(response.body.userReaction).toBe(null);
    expect(response.statusCode).toBe(StatusCodes.OK);
  });

  test('get reactions from an existing post that the user reacted to', async () => {
    prismaMock.post.findFirst.mockResolvedValue({
      ...post,
      _count: { reactions: 10 },
    } as any);
    prismaMock.reaction.findFirst.mockResolvedValue(reaction);

    const response = await request(app.express)
      .get(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.body.reactionCount).toBe(10);
    expect(response.body.userReaction).not.toBe(null);
    expect(response.statusCode).toBe(StatusCodes.OK);
  });
});

describe('POST /reaction/', () => {
  const endpoint = '/api/reaction/1';

  test('add reaction to a post without authentication', async () => {
    const response = await request(app.express).post(endpoint).send();

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('add reaction to a non existing post', async () => {
    prismaMock.post.findFirst.mockResolvedValue(null);

    const response = await request(app.express)
      .post(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test('add reaction to a post that has been already reacted to by the user', async () => {
    prismaMock.post.findFirst.mockResolvedValue(post);
    prismaMock.reaction.findFirst.mockResolvedValue(reaction);

    const response = await request(app.express)
      .post(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.CONFLICT);
  });

  test('add reaction to a post', async () => {
    prismaMock.post.findFirst.mockResolvedValue(post);
    prismaMock.reaction.findFirst.mockResolvedValue(null);

    const response = await request(app.express)
      .post(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.CREATED);
  });
});

describe('DELETE /reaction/', () => {
  const endpoint = '/api/reaction/1';

  test('remove reaction from a post without authentication', async () => {
    const response = await request(app.express).post(endpoint).send();

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('remove reaction from a non existing post', async () => {
    prismaMock.reaction.delete.mockResolvedValue(null as any);

    const response = await request(app.express)
      .delete(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test('remove reaction from a post that has been reacted to by the user', async () => {
    prismaMock.reaction.delete.mockResolvedValue(reaction);

    const response = await request(app.express)
      .delete(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.OK);
  });

  test('remove reaction from a post that has been not reacted to by the user', async () => {
    prismaMock.reaction.findFirst.mockResolvedValue(null);

    const response = await request(app.express)
      .delete(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('POST /comment/', () => {
  const endpoint = '/api/comment/1';

  test('empty body', async () => {
    const response = await request(app.express)
      .post(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test('create comment without authentication', async () => {
    const response = await request(app.express)
      .post(endpoint)
      .send({ content: 'this is a comment' });

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('create a comment with authentication to an existing post', async () => {
    prismaMock.post.findFirst.mockResolvedValue(post);
    prismaMock.comment.create.mockResolvedValue(comment);

    const response = await request(app.express)
      .post(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ content: 'this is a comment' });

    expect(response.statusCode).toBe(StatusCodes.CREATED);
  });

  test('create a comment with authentication to a non existing post', async () => {
    prismaMock.post.findFirst.mockResolvedValue(null);

    const response = await request(app.express)
      .post(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ content: 'this is a comment' });

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('GET /comment/', () => {
  const endpoint = '/api/comment/1';

  test('get comments without authentication', async () => {
    prismaMock.comment.findMany.mockResolvedValue([]);

    const response = await request(app.express).get(endpoint).send();

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('get comments form a post', async () => {
    prismaMock.post.findFirst.mockResolvedValue(post);
    prismaMock.comment.findMany.mockResolvedValue([comment]);

    const response = await request(app.express)
      .get(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.OK);
  });

  test('get comments from a non existent posts', async () => {
    prismaMock.post.findFirst.mockResolvedValue(null);
    prismaMock.comment.findMany.mockResolvedValue([comment]);

    const response = await request(app.express)
      .get(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('DELETE /comment/', () => {
  const endpoint = '/api/comment/1';

  test('delete comment without authentication', async () => {
    prismaMock.comment.delete.mockResolvedValue(comment);

    const response = await request(app.express).delete(endpoint).send();

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('delete non existing comment', async () => {
    prismaMock.comment.findFirst.mockResolvedValue(null);

    const response = await request(app.express)
      .delete(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test('delete a comment not owned by the user', async () => {
    prismaMock.comment.findFirst.mockResolvedValue({
      ...comment,
      authorId: '2',
    });

    const response = await request(app.express)
      .delete(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
  });

  test('delete a comment owned by the user', async () => {
    prismaMock.comment.findFirst.mockResolvedValue(comment);
    prismaMock.comment.delete.mockResolvedValue(comment);

    const response = await request(app.express)
      .delete(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.OK);
  });
});

describe('PATCH /comment/', () => {
  const endpoint = '/api/comment/1';

  test('edit comment without authentication', async () => {
    const response = await request(app.express)
      .patch(endpoint)
      .send({ content: 'edited comment text' });

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('edit non existing comment', async () => {
    prismaMock.comment.findFirst.mockResolvedValue(null);

    const response = await request(app.express)
      .patch(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ content: 'edited comment text' });

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test('edit a comment not owned by the user', async () => {
    prismaMock.comment.findFirst.mockResolvedValue({
      ...comment,
      authorId: '2',
    });

    const response = await request(app.express)
      .patch(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ content: 'edited comment text' });

    expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
  });

  test('edit a comment owned by the user', async () => {
    prismaMock.comment.findFirst.mockResolvedValue(comment);

    const response = await request(app.express)
      .patch(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ content: 'edited comment text' });

    expect(response.statusCode).toBe(StatusCodes.OK);
  });
});

describe('PATCH /user/', () => {
  const endpoint = '/api/user/';

  test('edit user profile without authentication', async () => {
    const response = await request(app.express).patch(endpoint).send();

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('edit profile input validation', async () => {
    prismaMock.profile.update.mockResolvedValue(profile);

    // first name
    const response = await request(app.express)
      .patch(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ firstName: '' });

    const response1 = await request(app.express)
      .patch(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ firstName: 'a'.repeat(32) });

    // last name
    const response2 = await request(app.express)
      .patch(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ lastName: '' });

    const response3 = await request(app.express)
      .patch(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ lastName: 'a'.repeat(32) });

    // description
    const response4 = await request(app.express)
      .patch(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ description: 'a'.repeat(1000) });

    // invalid birthDate
    const response5 = await request(app.express)
      .patch(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({ birthDate: 'invalid date' });

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response1.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response2.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response3.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response4.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response5.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test('edit own profile', async () => {
    prismaMock.profile.update.mockResolvedValue({
      ...profile,
      firstName: 'Test',
      lastName: 'Test',
      birthDate: new Date('1970-01-01'),
      description: 'This is a description.',
    });

    const response = await request(app.express)
      .patch(endpoint)
      .set('Cookie', 'accessToken=mock-access-token')
      .send({
        firstName: 'Test',
        lastName: 'Test',
        birthDate: '1970-01-01',
        description: 'This is a description.',
      });

    expect(response.statusCode).toBe(StatusCodes.OK);
  });
});

describe('POST /follow/', () => {
  const endpoint = '/api/follow/';

  test('follow a user unauthenticated', async () => {
    const response = await request(app.express)
      .post(endpoint + 'username1')
      .send();

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('follow a non existing user', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const response = await request(app.express)
      .post(endpoint + 'username1')
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test('follow an existing user', async () => {
    prismaMock.user.findFirst.mockResolvedValue({ ...user, id: '2' });
    prismaMock.follows.count.mockResolvedValue(0);
    prismaMock.follows.create.mockResolvedValue(follow);

    const response = await request(app.express)
      .post(endpoint + 'username1')
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.CREATED);
  });

  test('follow an already followed user', async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      ...user,
      id: '2',
      username: 'username1',
    });
    prismaMock.follows.count.mockResolvedValue(1);

    const response = await request(app.express)
      .post(endpoint + 'username1')
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.CONFLICT);
  });

  test('follow the user themself', async () => {
    prismaMock.user.findFirst.mockResolvedValue(user);

    const response = await request(app.express)
      .post(endpoint + 'username')
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.CONFLICT);
  });
});

describe('DELETE /follow/', () => {
  const endpoint = '/api/follow/';

  test('unfollow a user unauthenticated', async () => {
    const response = await request(app.express)
      .delete(endpoint + 'username1')
      .send();

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('unfollow a non existing user', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const response = await request(app.express)
      .delete(endpoint + 'username1')
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test('unfollow an existing user', async () => {
    prismaMock.user.findFirst.mockResolvedValue({ ...user, id: '2' });
    prismaMock.follows.create.mockResolvedValue(follow);

    const response = await request(app.express)
      .delete(endpoint + 'username1')
      .set('Cookie', 'accessToken=mock-access-token')
      .send();

    expect(response.statusCode).toBe(StatusCodes.OK);
  });
});
