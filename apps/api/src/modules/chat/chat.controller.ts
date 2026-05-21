import { type Request, type Response } from 'express';
import * as chatService from './chat.service';
import { chatCompletionSchema } from '@repo/validators';

export const getChat = async (req: Request, res: Response) => {
  const parsed = chatCompletionSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
    return;
  }

  await chatService.getChat(parsed.data, req.user.id, res);
};
