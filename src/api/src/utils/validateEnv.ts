import { cleanEnv, str, port, num } from 'envalid';

function validateEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production'],
    }),
    DATABASE_URL: str(),
    JWT_SECRET: str(),
    PORT: port({ default: 3000 }),
    MAX_FILE_SIZE: num(),
  });
}

export default validateEnv;
