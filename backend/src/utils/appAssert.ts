import assert from 'node:assert'
import AppError from './AppError'
import { HttpStatusCode } from '../constants/httpCode';
import AppErrorCode from '../constants/appErrorCode';
/*
    Assert a condition and throws a AppError if the condition is false
*/

type AppAssert = (
    condition:any,
    httpStatusCode:HttpStatusCode,
    message:string,
    appErrorCode?:AppErrorCode
) => asserts condition;


const appAssert:AppAssert = (
    condition,
    httpStatusCode,
    message,
    appErrorCode
) => {
    return assert(condition,new AppError(httpStatusCode, message, appErrorCode))
}

export default appAssert;