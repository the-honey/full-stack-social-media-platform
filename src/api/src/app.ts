import express, { Application } from 'express';
//import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middlewares/error.middleware';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import PostController from '@/resources/post/post.controller';
import UserController from '@/resources/user/user.controller';
import AuthController from '@/resources/auth/auth.controller';
import ReactionController from '@/resources/reaction/reaction.controller';
import CommentController from '@/resources/comment/comment.controller';
import FollowController from '@/resources/follow/follow.controller';
import VerificationController from './resources/verification/verification.controller';

class App {
  public express: Application;
  public port: number;

  constructor(db: PrismaClient) {
    this.express = express();
    this.port = Number(process.env.PORT);

    this.initialiseMiddleware();
    this.initialiseControllers([
      new PostController(db),
      new CommentController(db),
      new ReactionController(db),
      new UserController(db),
      new AuthController(db),
      new FollowController(db),
      new VerificationController(db),
    ]);
    this.initialiseErrorHandling();
    this.initialiseDbContext(db);
  }

  private initialiseMiddleware(): void {
    this.express.use(helmet());
    this.express.use(
      cors({ credentials: true, origin: 'http://localhost:5000' })
    );
    this.express.use(cookieParser());
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    //this.express.use(compression());
  }

  private initialiseControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use('/api', controller.router);
    });
  }

  private initialiseErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  private initialiseDbContext(db: PrismaClient): void {
    this.express.set('db', db);
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
