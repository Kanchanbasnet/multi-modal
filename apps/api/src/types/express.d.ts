import {type User } from "@repo/database";
import { type Logger } from "@repo/logger";


declare global {
    namespace Express {
        interface Request{
            log: Logger;
            user: User
        }
    }
}