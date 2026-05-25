import { createSlice } from '@reduxjs/toolkit';
import type { ConversationState } from '../../types';
import {
  deleteConversations,
  fetchConversations,
  newConversations,
} from '../thunks/conversationThunks';

const initialState: ConversationState = {
  list: [],
  isLoading: false,
  activeId: null,
  error: null,
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setActiveConversation(state, action) {
      state.activeId = action.payload;
    },
    updateTitle(state, action) {
      const convo = state.list.find((c) => c.id === action.payload.id);
      if (convo) convo.title = action.payload.title;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Failed to Load Conversations!';
      })
      .addCase(newConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list.unshift(action.payload);
        state.activeId = action.payload.id;
      })
      .addCase(newConversations.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Failed to create new conversation!';
      })
      .addCase(deleteConversations.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        if (state.activeId === action.payload) state.activeId = null;
      });
  },
});

export const { setActiveConversation, updateTitle } = conversationSlice.actions;
export default conversationSlice.reducer;
