import { type Request, type Response, type NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '@repo/database';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const token = authHeader.slice(7);
  const tokenHash = crypto.createHash('sha512').update(token).digest('hex');

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date() || !session.user.isActive) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  req.user = session.user;
  next();
};
