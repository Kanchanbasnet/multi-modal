import express, {type Application} from 'express';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';


export const createApp = (): Application=>{
    const app = express();

    app.use(express.json());
    app.use(requestLogger);


    app.get('/health', (_req, res)=>{
        res.json({status: 'ok'});
    });

    app.use(errorHandler);

    return app;
}