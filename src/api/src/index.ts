import 'dotenv/config';
import 'tsconfig-paths/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import { db } from '@/utils/db';

validateEnv();

const app = new App(db);

app.listen();
