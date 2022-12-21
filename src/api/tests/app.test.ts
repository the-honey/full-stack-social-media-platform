import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import App from '../src/app';
import { prismaMock } from './prismaMock';
import { STATUS_CODES } from 'http';

const app = new App(prismaMock);

describe('POST /auth/login', () => {
  test('should return status code 403', async () => {
    const response = await request(app.express)
      .post('/api/auth/login')
      .send({ username: 'thehoney', password: 'password' });

    console.log(response.body.message);
    expect(response.statusCode).toBe(STATUS_CODES.OK);
  });
});
