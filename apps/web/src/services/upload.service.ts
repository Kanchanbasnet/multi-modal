import { api } from './api';

type UploadResponse = {
  fileId: string;
  url: string;
  fileType: string;
  name: string;
  extractedText: string | null;
};

type ApiUploadResponse = {
  success: boolean;
  data: UploadResponse;
};

export const uploadFile = async (file: File, conversationId: string): Promise<UploadResponse> => {
  const formdata = new FormData();
  formdata.append('file', file);
  formdata.append('conversationId', conversationId);

  const response = await api.post<ApiUploadResponse>('/fileUpload', formdata, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (!response.data.success) throw new Error('File upload failed');
  return response.data.data;
};
