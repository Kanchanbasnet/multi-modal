import type { Message, Conversation, ApiResponse } from '../types';
import { api } from './api';

export const getUserConversations = async () => {
  const response = await api.get<ApiResponse<Conversation[]>>(`/conversations`);
  if (response.data.success) {
    return response.data.data;
  }
  return [];
};

export const newConversation = async () => {
  const response = await api.post<ApiResponse<Conversation>>(`/conversations/new`);
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error('Failed to create conversation');
};

export const deleteConversation = async (id: string) => {
  await api.delete(`/conversations/${id}`);
};

export const getMessages = async (conversationId: string) => {
  const response = await api.get<ApiResponse<Message[]>>(
    `/conversations/${conversationId}/messages`,
  );
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error('Failed to retrieve the messages');
};

export const getArchiveConversations = async () => {
  const response = await api.get<ApiResponse<Conversation>>(`/conversations/archieveConversation`);
  if (response.data.success) {
    return response.data.data;
  }
  return [];
};

export const archiveConversation = async (conversationId: string) => {
  const response = await api.post<ApiResponse<Conversation>>(`/${conversationId}/archieve`);
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error('Failed to Archive Conversation.');
};
