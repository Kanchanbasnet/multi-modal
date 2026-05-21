import { supabaseConfig } from '@repo/config';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@repo/database';
import { type FileType } from '@repo/database';
import { extractText } from '../../helpers/chunkDocuments';
const supabase = createClient(supabaseConfig.supabaseurl, supabaseConfig.supabaseServiceKey);

export const uploadFile = async (
  file: Express.Multer.File,
  conversationId: string,
  fileType: FileType,
) => {
  const fileName = `${conversationId}/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from('chat-files')
    .upload(fileName, file.buffer, { contentType: file.mimetype });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from('chat-files').getPublicUrl(fileName);

  const extractedText =
    fileType === 'DOCUMENT' ? await extractText(file.mimetype, data.publicUrl, file) : null;

  const saved = await prisma.file.create({
    data: {
      conversationId,
      fileType,
      url: data.publicUrl,
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      ...(extractedText !== null && { extractedText }),
    },
  });

  return saved;
};
