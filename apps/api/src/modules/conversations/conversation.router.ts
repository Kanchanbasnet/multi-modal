import { Router, type Router as ExpressRouter } from 'express';
import {
  archieveConversation,
  deleteConversation,
  getALLArchiveConversation,
  getAllUserConversation,
  getConversationById,
  getMessagesByConversationId,
  newConversation,
} from './conversation.controller';

const router: ExpressRouter = Router();

router.get('/', getAllUserConversation);
router.get('/archieveConversation', getALLArchiveConversation);
router.get('/:conversationId', getConversationById);
router.get('/:conversationId/messages', getMessagesByConversationId);

router.post('/new', newConversation);

router.patch('/:conversationId/archieve', archieveConversation);
router.delete('/:conversationId', deleteConversation);

export default router;
