import { api } from './api';
import type { User } from '../types';

export const requestMagicLink = async (email: string) => {
  const response = await api.post('/auth/magic-link/request', { email });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get<{ success: boolean; user: User }>('/auth/me');
  return response.data.user;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const loginWithGoogle = () => {
  window.location.href = '/api/auth/google';
};
