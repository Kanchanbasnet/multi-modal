import healthRouter from '../modules/health/health.router';
import { Router, type Router as ExpressRouter } from 'express';
import userRouter from '../modules/users/user.router';
import authRouter from '../modules/auth/auth.router';
import chatRouter from '../modules/chat/chat.router';

const router: ExpressRouter = Router();

router.use('/health', healthRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/chat', chatRouter);

export default router;
