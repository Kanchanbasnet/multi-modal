import express, { type Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import router from './routes';

export const createApp = (): Application => {
  const app = express();
  const ALLOWED_ORIGINS = process.env['ALLOWED_ORIGINS']?.split(',') ?? ['http://localhost:3001'];

  app.use(helmet());
  app.use(
    cors({
      origin: ALLOWED_ORIGINS,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
  );

  app.use(express.json());
  app.use(requestLogger);
  app.use('/api', router);

  app.use(errorHandler);

  return app;
};
