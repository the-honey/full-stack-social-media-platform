import {
  Reaction,
  User,
  Post,
  Comment,
  Profile,
  Follows,
} from '@prisma/client';

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

const post: Post = {
  id: '1',
  authorId: '1',
  content: 'this is a post',
  createdAt: new Date('2022-12-01 00:00:00'),
  updatedAt: new Date('2022-12-01 00:00:00'),
};

const reaction: Reaction = {
  authorId: '1',
  postId: '1',
  createdAt: new Date('2022-12-01 00:00:00'),
  type: 'LIKE',
};

const comment: Comment = {
  id: '1',
  authorId: '1',
  postId: '1',
  createdAt: new Date('2022-12-01 00:00:00'),
  updatedAt: new Date('2022-12-01 00:00:00'),
  content: 'this is a comment',
};

const profile: Profile = {
  id: 1,
  firstName: 'Test',
  lastName: 'Test',
  description: null,
  birthDate: new Date('2000-06-12'),
  profilePicUrl: null,
};

const follow: Follows = {
  followerId: '1',
  followingId: '2',
};

export {
  user,
  registerInput,
  loginInput,
  post,
  reaction,
  comment,
  profile,
  follow,
};
