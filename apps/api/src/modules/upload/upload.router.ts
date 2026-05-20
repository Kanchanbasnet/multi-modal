import { Router, type Router as ExpressRouter } from 'express';
import multer from 'multer';
import { uploadFile } from './upload.controller';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router: ExpressRouter = Router();

router.post('/', upload.single('file'), uploadFile);

export default router;
