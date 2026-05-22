import type { UploadedFile } from '../types';
import { api } from './api';

export const uploadFile = async (file: File, conversationId: string): Promise<UploadedFile> => {
  const formdata = new FormData();
  formdata.append('file', file);
  formdata.append('conversationId', conversationId);

  const response = await api.post<UploadedFile>('/fileUpload', formdata, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
