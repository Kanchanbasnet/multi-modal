import healthRouter from '../modules/health/health.router';
import { Router, type Router as ExpressRouter } from 'express';
import userRouter from '../modules/users/user.router';

const router: ExpressRouter = Router();

router.use('/health', healthRouter);
router.use('/users', userRouter);

export default router;
