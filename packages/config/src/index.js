"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = exports.authConfig = exports.dbConfig = exports.env = void 0;
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const zod_1 = require("zod");
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
// Lets define .env schema now
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(3000),
    DATABASE_URL: zod_1.z.string().min(1, 'Database Url is required.'),
    BASE_URL: zod_1.z.url(),
    // REDIS_URL: z.string().min(1, 'Redis Url is required.'),
    // JWT_SECRET: z.string().min(32, 'JWT secret is required.'),
    // JWT_EXPIRES_IN: z.string().default('1d'),
    // SESSION_SECRET: z.string().min(32, 'Session secret is required.'),
    // //Google Oauth
    GOOGLE_CLIENT_ID: zod_1.z.string().min(1, 'GOOGLE CLIENT ID is required.'),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().min(1, 'GOOGLE CLIENT Secret is required.'),
    GOOGLE_CALLBACK_URL: zod_1.z.url(),
    // //Email
    // RESEND_API_KEY: z.string().min(1, 'Resend API key is required.'),
    // EMAIL_FROM: z.email(),
    // OPENAI_API_KEY: z.string().startsWith('sk', 'OPENAI Key starts with sk.'),
    // ENCRYPTION_KEY: z.string().length(64, 'Encryption Key must be exactly 64 characters.'),
    // FREE_DAILY_LIMIT: z.coerce.number().default(5),
    FRONTEND_URL: zod_1.z.url(),
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
exports.env = parsed.data;
exports.dbConfig = {
    url: exports.env.DATABASE_URL,
};
// export const redisConfig = {
//   url: env.REDIS_URL,
// } as const;
exports.authConfig = {
    // jwtSecret: env.JWT_SECRET,
    // jwtExpiresIn: env.JWT_EXPIRES_IN,
    // sessionSecret: env.SESSION_SECRET,
    googleAuth: {
        clientId: exports.env.GOOGLE_CLIENT_ID,
        clientSecret: exports.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: exports.env.GOOGLE_CALLBACK_URL,
    },
};
// export const emailConfig = {
//   apiKey: env.RESEND_API_KEY,
//   from: env.EMAIL_FROM,
// } as const;
exports.appConfig = {
    nodeEnv: exports.env.NODE_ENV,
    port: exports.env.PORT,
    baseUrl: exports.env.BASE_URL,
    frontendUrl: exports.env.FRONTEND_URL,
    // encryptionKey: env.ENCRYPTION_KEY,
};
// export const openaiConfig = {
//   openaiApiKey: env.OPENAI_API_KEY,
// } as const;
// export const rateLimit = {
//   dailyLimit: env.FREE_DAILY_LIMIT,
// } as const;
