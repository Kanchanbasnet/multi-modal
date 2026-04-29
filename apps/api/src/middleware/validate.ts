import {type Request, type Response, type NextFunction} from 'express';
import {type ZodType} from 'zod';

// this kind of pattern is called factory pattern that creates and return another function
export const validate =(schema: ZodType)=>(req: Request, res: Response, next: NextFunction): void=>{
const result = schema.safeParse(req.body);


if(!result.success){
    res.status(400).json({
        success: false,
        errors: result.error.flatten().fieldErrors,
    });
    return;
}

req.body = result.data;
next();
}