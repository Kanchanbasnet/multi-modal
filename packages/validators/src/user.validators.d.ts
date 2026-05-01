import { z } from 'zod';
export declare const userUpdateSchema: z.ZodObject<
  {
    name: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodURL>;
  },
  z.core.$strip
>;
export declare const updateOpenAiKey: z.ZodObject<
  {
    openAiKey: z.ZodString;
  },
  z.core.$strip
>;
export type UpdateUserInput = z.infer<typeof userUpdateSchema>;
export type UpdateOpenAIInput = z.infer<typeof updateOpenAiKey>;
//# sourceMappingURL=user.validators.d.ts.map
