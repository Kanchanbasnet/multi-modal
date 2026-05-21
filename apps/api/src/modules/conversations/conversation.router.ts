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
import { authenticate } from '../../middleware/authenticate';

const router: ExpressRouter = Router();

router.get('/', authenticate, getAllUserConversation);
router.get('/archieveConversation', authenticate, getALLArchiveConversation);
router.get('/:conversationId', authenticate, getConversationById);
router.get('/:conversationId/messages', authenticate, getMessagesByConversationId);

router.post('/new', authenticate, newConversation);

router.patch('/:conversationId/archieve', authenticate, archieveConversation);
router.delete('/:conversationId', authenticate, deleteConversation);

export default router;
