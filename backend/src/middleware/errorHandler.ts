import { ErrorRequestHandler, Response } from 'express'
import { z } from 'zod';
import { BAD_REQUEST } from '../constants/http';
import AppError from '../utils/AppError';

const handleZodError = (res:Response, error:z.ZodError) => {
    const errors = error.issues.map((err) => {
        return {
            path:err.path.join("."),
            message:err.message
        }
    })
    res.status(BAD_REQUEST).json({
        message:error.message,
        errors
    })
}

const handleAppError = (res:Response, error:AppError) => {
    res.status(error.statusCode).json({
        message:error.message,
        errorCode:error.errorCode
    });
}

const errorHandler:ErrorRequestHandler = (error, req, res, next) => {
    console.log(`Path ${req.path}`, error);
    if(error instanceof z.ZodError){
        return handleZodError(res, error);
    } 
    if(error instanceof AppError){
        return handleAppError(res, error)
    }

    res.status(500).send("Internal Server error")
}

export default errorHandler;