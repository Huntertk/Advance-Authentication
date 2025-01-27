import { ErrorRequestHandler } from 'express'

const errorHandler:ErrorRequestHandler = (error, req, res, next) => {
    console.log(`Path ${req.path}`, error);
    res.status(500).send("Internal Server error")
}

export default errorHandler;