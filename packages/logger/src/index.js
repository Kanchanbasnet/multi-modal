"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const isDev = process.env['NODE_ENV'] !== 'production';
// in dev environemnt we get colored logs in production only plain json is logged.
exports.logger = (0, pino_1.default)({
    level: isDev ? 'debug' : 'info',
    ...(isDev && {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        },
    }),
});
const createLogger = (context) => {
    return exports.logger.child(context);
};
exports.createLogger = createLogger;
