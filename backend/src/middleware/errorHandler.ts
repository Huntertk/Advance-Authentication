import { ErrorRequestHandler, Response } from "express";
import { z } from "zod";
import { INTERNAL_SERVER_ERROR } from "../constants/httpCode";
import AppError from "../utils/AppError";

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

const handleAppError = (res:Response, error:AppError) => {
    return res.status(error.statusCode).json({
        message:error.message,
        errorCode:error.errorCode
    })
}

const errorHandler:ErrorRequestHandler = (error, req, res, next) => {
    console.log(`PATH: ${req.path}`, error);
    if(error instanceof z.ZodError){
        handleZodError(res, error);
    } else if(error instanceof AppError){
        handleAppError(res, error)
    } else {
        res.status(INTERNAL_SERVER_ERROR).send("Internal server error")
    }
    
}

export default errorHandler;