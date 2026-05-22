import { api } from './api';
import type { User } from '../types';

export const getUser = async (id: string) => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, data: { name?: string; avatarUrl?: string }) => {
  const response = await api.patch<User>(`/users/${id}`, data);
  return response.data;
};
