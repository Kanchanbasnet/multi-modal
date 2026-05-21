import mammoth from 'mammoth';
import { toFile } from 'openai';
import { PDFParse } from 'pdf-parse';
import { grokaiConfig } from '@repo/config';

import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: grokaiConfig.grokaiApikey });

export const transcribeAudio = async (file: Express.Multer.File): Promise<string> => {
  const audioFile = await toFile(file.buffer, file.originalname, { type: file.mimetype });

  const transcription = await groq.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-large-v3',
  });

  return transcription.text;
};

export const extractText = async (
  mimeType: string,
  fileUrl: string,
  file: Express.Multer.File,
): Promise<string | null> => {
  if (mimeType === 'application/pdf') {
    const parser = new PDFParse({ url: fileUrl });
    const result = await parser.getText();
    await parser.destroy();
    const extractedText = result.text as string;
    return extractedText;
  }

  if (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }
  if (mimeType === 'text/plain') {
    return file.buffer.toString('utf-8');
  }
  return null;
};
