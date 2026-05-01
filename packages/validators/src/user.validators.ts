import { z } from 'zod';

export const userUpdateSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').max(100, 'Name too long').optional(),
  avatarUrl: z.url('Must be a valid Url.').optional(),
});

export const updateOpenAiKey = z.object({
  openAiKey: z.string().min(1, 'OpenAI key cannot be empty'),
});

export type UpdateUserInput = z.infer<typeof userUpdateSchema>;
export type UpdateOpenAIInput = z.infer<typeof updateOpenAiKey>;
