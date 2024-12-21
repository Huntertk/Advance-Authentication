import { ErrorRequestHandler, Response } from "express";
import { z } from "zod";

const handleZodError = (res:Response, error:z.ZodError) => {
    const errors = error.issues.map((issue) => {
        return {
            path: issue.path.join('.'),
            message:issue.message
        }
    })
    return res.status(400).json(
        {
            messgae:error.message,
            errors
        }
    )
}

const errorHandler:ErrorRequestHandler = (error, req, res, next) => {
    console.log(`PATH: ${req.path}`, error);
    if(error instanceof z.ZodError){
        handleZodError(res, error);
    } else {
        res.status(500).send("Internal server error")
    }
    
}

export default errorHandler;