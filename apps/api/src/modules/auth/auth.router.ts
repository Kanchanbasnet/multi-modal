import { Router, type Router as ExpressRouter } from "express";
import { validate } from "../../middleware/validate";
import { requestMagicLinkSchema} from "@repo/validators";
import { googleAuth, googleCallback, logout, requestMagicLink, verifyMagicLink } from "./auth.controller";
import { authenticate } from "../../middleware/authenticate";

const router: ExpressRouter = Router()


router.post('/magic-link/request', validate(requestMagicLinkSchema), requestMagicLink );
router.get('/magic-link/verify', verifyMagicLink);
router.post('/logout', authenticate, logout);

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
export default router;