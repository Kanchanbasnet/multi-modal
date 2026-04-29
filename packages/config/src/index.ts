import * as dotenv from 'dotenv';
import * as path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Lets define .env schema now

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, 'Database Url is required.'),
  // REDIS_URL: z.string().min(1, 'Redis Url is required.'),
  // JWT_SECRET: z.string().min(32, 'JWT secret is required.'),
  // JWT_EXPIRES_IN: z.string().default('1d'),
  // SESSION_SECRET: z.string().min(32, 'Session secret is required.'),

  // //Google Oauth

  // GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE CLIENT ID is required.'),
  // GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE CLIENT Secret is required.'),
  // GOOGLE_CALLBACK_URL: z.url(),

  // //Email

  // RESEND_API_KEY: z.string().min(1, 'Resend API key is required.'),
  // EMAIL_FROM: z.email(),
  // OPENAI_API_KEY: z.string().startsWith('sk', 'OPENAI Key starts with sk.'),

  // ENCRYPTION_KEY: z.string().length(64, 'Encryption Key must be exactly 64 characters.'),
  // FREE_DAILY_LIMIT: z.coerce.number().default(5),
  // FRONTEND_URL: z.url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(`Environment variable is missing or invalid!`);
  parsed.error.issues.forEach((issue) => {
    console.error(`${issue.path.join('.')}-${issue.message}`);
  });
  console.error(`Please check your .env file.`);
  process.exit(1);
}

export const env = parsed.data;

export const dbConfig = {
  url: env.DATABASE_URL,
} as const;

// export const redisConfig = {
//   url: env.REDIS_URL,
// } as const;

// export const authConfig = {
//   jwtSecret: env.JWT_SECRET,
//   jwtExpiresIn: env.JWT_EXPIRES_IN,
//   sessionSecret: env.SESSION_SECRET,
//   googleAuth: {
//     clientId: env.GOOGLE_CLIENT_ID,
//     clientSecret: env.GOOGLE_CLIENT_SECRET,
//     callbackUrl: env.GOOGLE_CALLBACK_URL,
//   },
// } as const;

// export const emailConfig = {
//   apiKey: env.RESEND_API_KEY,
//   from: env.EMAIL_FROM,
// } as const;

export const appConfig = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  // frontendUrl: env.FRONTEND_URL,
  // encryptionKey: env.ENCRYPTION_KEY,
} as const;

// export const openaiConfig = {
//   openaiApiKey: env.OPENAI_API_KEY,
// } as const;

// export const rateLimit = {
//   dailyLimit: env.FREE_DAILY_LIMIT,
// } as const;
