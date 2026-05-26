import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteConversation,
  getUserConversations,
  newConversation,
} from '../../services/conversation.service';

export const fetchConversations = createAsyncThunk('conversation/fetchConversations', async () => {
  return await getUserConversations();
});

export const newConversations = createAsyncThunk('conversation/new', async () => {
  return await newConversation();
});

export const deleteConversations = createAsyncThunk('conversation/delete', async (id: string) => {
  await deleteConversation(id);
  return id;
});

export const archiveConversation = createAsyncThunk(
  'conversation/archive',
  async (conversationId: string) => {
    await archiveConversation(conversationId);
    return conversationId;
  },
);
