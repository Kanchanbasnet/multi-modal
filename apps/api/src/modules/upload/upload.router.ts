import { Router, type Router as ExpressRouter } from 'express';
import multer from 'multer';
import { uploadFile } from './upload.controller';
import { authenticate } from '../../middleware/authenticate';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router: ExpressRouter = Router();

router.post('/', authenticate, upload.single('file'), uploadFile);

export default router;
