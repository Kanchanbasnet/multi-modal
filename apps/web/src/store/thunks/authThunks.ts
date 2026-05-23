import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMe, logout } from '../../services/auth.service';

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await getMe();
    } catch {
      return rejectWithValue('Not Authenticated.');
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logout();
});
