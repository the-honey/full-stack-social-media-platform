import { Request, Response, NextFunction } from 'express';
import authenticatedMiddleware from '@/middlewares/auth.middleware';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { user } from './data';

async function mockAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  res.locals.user = user;
  return next();
}

jest.mock('@/middlewares/auth.middleware', () => ({
  default: mockAuthMiddleware,
}));

beforeEach(() => {
  mockReset(mock);
});

export const prismaMock =
  mockAuthMiddleware as unknown as DeepMockProxy<mockAuthMiddleware>;
