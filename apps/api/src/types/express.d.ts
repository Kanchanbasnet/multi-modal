import { type Logger } from "@repo/logger";


declare global {
    namespace Express {
        interface Request{
            log: Logger;
        }
    }
}