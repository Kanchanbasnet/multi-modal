import { type Request, type Response } from 'express';
import * as uploadService from './upload.service';
import { type FileType } from '@repo/database';

const MIME_TO_FILE_TYPE: Record<string, FileType> = {
  'image/jpeg': 'IMAGE',
  'image/png': 'IMAGE',
  'image/gif': 'IMAGE',
  'image/webp': 'IMAGE',
  'application/pdf': 'DOCUMENT',
  'text/plain': 'DOCUMENT',
  'application/msword': 'DOCUMENT',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCUMENT',
  'audio/mpeg': 'AUDIO',
  'audio/wav': 'AUDIO',
  'audio/mp4': 'AUDIO',
};

export const uploadFile = async (req: Request, res: Response) => {
  const file = req.file;
  const { conversationId } = req.body;

  if (!file) {
    res.status(400).json({ success: false, message: 'No file provided' });
    return;
  }

  if (!conversationId) {
    res.status(400).json({ success: false, message: 'ConversationId is required.' });
    return;
  }

  const fileType = MIME_TO_FILE_TYPE[file.mimetype];

  if (!fileType) {
    res.status(400).json({ success: false, message: 'Unsupported file type.' });
    return;
  }

  try {
    const uploaded = await uploadService.uploadFile(file, conversationId, fileType);
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      data: {
        fileId: uploaded.id,
        url: uploaded.url,
        fileType: uploaded.fileType,
        name: uploaded.name,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'File upload failed.' });
  }
};
