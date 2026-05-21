import { z } from 'zod';

export const chatCompletionSchema = z.object({
  conversationId: z.string().min(1, 'conversation id is required.'),
  message: z.string().min(1, 'Message cannot be empty.'),
  model: z.string().default('gpt-4o-mini'),
  fileId: z.string().optional(),
});

export type ChatCompletionInput = z.infer<typeof chatCompletionSchema>;
