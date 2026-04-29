import healthRouter from '../modules/health/health.router';
import { Router, type Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

router.use('/health', healthRouter);

export default router;
