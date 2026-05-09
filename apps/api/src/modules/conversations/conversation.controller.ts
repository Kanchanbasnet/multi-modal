import { type Request, type Response } from 'express';
import * as conversationService from './conversation.service';

export const newConversation = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const conversation = await conversationService.newConversation(userId);
  res
    .status(200)
    .json({ success: true, message: 'New Conversation Created Successfully', data: conversation });
};

export const getAllUserConversation = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const userConversation = await conversationService.getUserConversation(userId);
  res.status(200).json({
    success: true,
    message: 'User Conversations retrieved Successfully.',
    data: userConversation,
  });
};

export const getConversationById = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const userId = req.user.id;
  const conversation = await conversationService.getConversationById(
    conversationId as string,
    userId,
  );
  if (!conversation) {
    res.status(404).json({ success: false, message: 'ConversationId Not Found.' });
    return;
  }
  res
    .status(200)
    .json({ success: true, message: 'Conversation retrieved Successfully.', data: conversation });
};

export const archieveConversation = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const userId = req.user.id;
  const conversation = await conversationService.getConversationById(
    conversationId as string,
    userId,
  );
  if (!conversation) {
    res.status(404).json({ success: false, message: 'Conversation Not Found.' });
    return;
  }
  await conversationService.archieveConversation(conversationId as string, userId);

  res.status(200).json({ success: true, message: 'Conversation archived Successfully.' });
};

export const deleteConversation = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const userId = req.user.id;
  const conversation = await conversationService.getConversationById(
    conversationId as string,
    userId,
  );
  if (!conversation) {
    res.status(404).json({ success: false, message: 'Conversation Not Found.' });
    return;
  }
  await conversationService.deleteConversation(conversationId as string, userId);
  res.status(200).json({ success: true, message: 'Conversation deleted Successfully.' });
};

export const getALLArchiveConversation = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const conversation = await conversationService.getArchiveConversation(userId);
  res.status(200).json({
    success: true,
    message: 'Archived Conversation retrieved Successfully.',
    data: conversation,
  });
};
