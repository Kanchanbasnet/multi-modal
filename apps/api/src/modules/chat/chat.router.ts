import { Router, type Router as ExpressRouter } from 'express';
import { getChat } from './chat.controller';
import { authenticate } from '../../middleware/authenticate';

const router: ExpressRouter = Router();

router.post('/completions', authenticate, getChat);

export default router;
