import 'dotenv/config';
import 'tsconfig-paths/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import PostController from '@/resources/post/post.controller';
import UserController from '@/resources/user/user.controller';
import AuthController from '@/resources/auth/auth.controller';
import ReactionController from '@/resources/reaction/reaction.controller';
import CommentController from '@/resources/comment/comment.controller';
import FollowController from '@/resources/follow/follow.controller';
import VerificationController from './resources/verification/verification.controller';

validateEnv();

const app = new App(
  [
    new PostController(),
    new CommentController(),
    new ReactionController(),
    new UserController(),
    new AuthController(),
    new FollowController(),
    new VerificationController(),
  ],
  Number(process.env.PORT)
);

app.listen();
