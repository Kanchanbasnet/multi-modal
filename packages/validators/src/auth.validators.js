"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMagicLinkSchema = exports.requestMagicLinkSchema = void 0;
const zod_1 = require("zod");
//Magic Link Authentication
exports.requestMagicLinkSchema = zod_1.z.object({
    email: zod_1.z.email('Must be a valid email.'),
});
exports.verifyMagicLinkSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token is required.'),
});
