import {z} from "zod";




//Magic Link Authentication
export const requestMagicLinkSchema = z.object({
    email: z.email("Must be a valid email.")

})

export const verifyMagicLinkSchema = z.object({
    token: z.string().min(1, 'Token is required.')
})


export type RequestMagicLinkInput = z.infer<typeof requestMagicLinkSchema>;
export type VerifyMagicLinkInput = z.infer<typeof verifyMagicLinkSchema>;