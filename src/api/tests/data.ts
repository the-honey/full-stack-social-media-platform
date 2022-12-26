import { User } from '@prisma/client';

const user: User = {
  id: '1',
  username: 'testuser',
  password: 'password',
  isEmailVerified: true,
  profileId: 1,
  email: 'testuser@test.com',
  createdAt: new Date('2000-01-01'),
};

const registerInput = {
  username: 'testuser',
  password: 'password',
  passwordConfirm: 'password',
  birthDate: '2000-01-01',
  firstName: 'Test',
  lastName: 'Test',
  email: 'testuser@test.com',
};

const loginInput = {
  username: 'username',
  password: 'password',
};

export { user, registerInput, loginInput };
