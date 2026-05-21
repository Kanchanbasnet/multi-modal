import { z } from 'zod';

const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, 'Message content cannot be empty.'),
});

export const chatCompletionSchema = z.object({
  conversationId: z.string().min(1, 'conversation id is required.'),
  userId: z.string().min(1, 'user id is required.'),
  message: z.string().min(1, 'Message cannot be empty.'),
  model: z.string().default('gpt-4o-mini'),
  fileId: z.string().optional(),
});

export type ChatCompletionInput = z.infer<typeof chatCompletionSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
