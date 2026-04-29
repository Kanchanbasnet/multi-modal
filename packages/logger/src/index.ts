import pino from 'pino';

const isDev = process.env['NODE_ENV'] !== 'production';

// in dev environemnt we get colored logs in production only plain json is logged.

export const logger = pino({
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

export type Logger = pino.Logger;

export const createLogger = (context: Record<string, unknown>): Logger => {
  return logger.child(context);
};
