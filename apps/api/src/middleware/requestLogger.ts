import { type Request, type Response, type NextFunction } from 'express';
import { logger } from '@repo/logger';

export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  req.log = logger.child({ requestId: crypto.randomUUID() });
  req.log.info({ method: req.method, url: req.url }, 'Incoming Request');
  next();
};
