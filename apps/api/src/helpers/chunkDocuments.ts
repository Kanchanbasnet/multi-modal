import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

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
