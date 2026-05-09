import { Router, type Router as ExpressRouter } from 'express';
import {
  archieveConversation,
  deleteConversation,
  getALLArchiveConversation,
  getAllUserConversation,
  getConversationById,
  newConversation,
} from './conversation.controller';

const router: ExpressRouter = Router();

router.get('/', getAllUserConversation);
router.get('/archieveConversation', getALLArchiveConversation);
router.get('/:conversationId', getConversationById);
router.post('/new', newConversation);

router.patch('/:conversationId/archieve', archieveConversation);
router.delete('/:conversationId', deleteConversation);

export default router;
