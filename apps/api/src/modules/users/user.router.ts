import { Router, type Router as ExpressRouter } from 'express';
import { authenticate } from '../../middleware/authenticate';
import {
  createUser,
  getUserById,
  softDeleteUserById,
  updateOpenAIKey,
  updateUserById,
} from './user.controller';
import { validate } from '../../middleware/validate';
import { updateOpenAiKey, userUpdateSchema } from '@repo/validators';

const router: ExpressRouter = Router();

router.get('/me', authenticate, getUserById);
router.post('/createUser', createUser);
router.patch('/me', authenticate, validate(userUpdateSchema), updateUserById);
router.patch('/me/openai-key', authenticate, validate(updateOpenAiKey), updateOpenAIKey);
router.delete('/me', authenticate, softDeleteUserById);

export default router;
