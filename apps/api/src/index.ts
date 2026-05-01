import '@repo/config';
import { createApp } from './app';
import { logger } from '@repo/logger';

const PORT = process.env['PORT'] ?? 3000;

const app = createApp();

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
