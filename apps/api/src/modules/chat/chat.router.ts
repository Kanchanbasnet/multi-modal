import { Router, type Router as ExpressRouter } from 'express';
import { getChat } from './chat.controller';

const router: ExpressRouter = Router();

router.post('/completions', getChat);

export default router;
