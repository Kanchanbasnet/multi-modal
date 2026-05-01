import { type Request, type Response, type NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  req.log.error({ err }, 'Unhandled Error');
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
