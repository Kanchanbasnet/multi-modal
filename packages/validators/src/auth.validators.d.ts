import { z } from 'zod';
export declare const requestMagicLinkSchema: z.ZodObject<
  {
    email: z.ZodEmail;
  },
  z.core.$strip
>;
export declare const verifyMagicLinkSchema: z.ZodObject<
  {
    token: z.ZodString;
  },
  z.core.$strip
>;
export type RequestMagicLinkInput = z.infer<typeof requestMagicLinkSchema>;
export type VerifyMagicLinkInput = z.infer<typeof verifyMagicLinkSchema>;
//# sourceMappingURL=auth.validators.d.ts.map
