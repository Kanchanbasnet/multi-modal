import { z } from 'zod';

const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, 'Message content cannot be empty.'),
});

export const chatCompletionSchema = z.object({
  messages: z.array(messageSchema).min(1, 'At least one message is required.'),
  model: z.string().default('gpt-4o-mini'),
});

export type ChatCompletionInput = z.infer<typeof chatCompletionSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
