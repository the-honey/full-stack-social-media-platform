import request from 'supertest';
import App from '@/app';
import { StatusCodes } from 'http-status-codes';
import { prismaMock } from './prismaMock';
import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { loginInput, user, registerInput } from './data';
import 'dotenv/config';

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

    const response = await request(app.express).post(endpoint).send(loginInput);

    expect(response.statusCode).toBe(StatusCodes.OK);
  });
});

describe('POST /post/', () => {
  const endpoint = '/api/post/';

  //test('create post without authentication', async () => {});

  // test('empty body', async () => {
  //   const response = await request(app.express).post(endpoint).send({});

  //   expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  // });
});

// prismaMock.user.count.mockResolvedValue(0);
// prismaMock.user.create.mockResolvedValue(user);

/*
describe('POST /auth/login', () => {
  test('should return status code 403', async () => {
    const response = await request(app.express)
      .post('/api/auth/login')
      .send({ username: 'thehoney', password: 'password' });

    console.log(response.body.message);
    expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
  });
});

describe('POST /post', () => {
  test('unable to create post unauthorised', async () => {
    const response = await request(app.express)
      .post('/api/post')
      .send({ content: 'Hello' });

    console.log(response.body.message);
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });
});
*/
