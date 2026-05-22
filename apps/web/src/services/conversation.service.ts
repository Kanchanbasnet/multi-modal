import type { Message, Conversation } from '../types';
import { api } from './api';

export const getUserConversations = async () => {
  const response = await api.get<Conversation[]>(`/conversations`);
  return response.data;
};

export const newConversation = async () => {
  const response = await api.post(`/conversations`);
  return response.data;
};

export const deleteConversation = async (id: string) => {
  await api.delete(`/conversations/${id}`);
};

export const getMessages = async (conversationId: string) => {
  const response = await api.get<Message[]>(`/conversations/${conversationId}/messages`);
  return response.data;
};
