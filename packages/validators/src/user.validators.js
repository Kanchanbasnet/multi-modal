"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOpenAiKey = exports.userUpdateSchema = void 0;
const zod_1 = require("zod");
exports.userUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name cannot be empty').max(100, 'Name too long').optional(),
    avatarUrl: zod_1.z.url('Must be a valid Url.').optional(),
});
exports.updateOpenAiKey = zod_1.z.object({
    openAiKey: zod_1.z.string().min(1, 'OpenAI key cannot be empty'),
});
