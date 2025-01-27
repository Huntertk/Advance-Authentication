import { CookieOptions, Response } from "express";
import { NODE_ENV } from "../constants/env";
import { fifteenMinuteFromNow, thirtyDaysFromNow } from "./date";

const secure = NODE_ENV !== "developement"

const defaults:CookieOptions = {
    sameSite:"strict",
    httpOnly: true,
    secure,
}

const getAccessTokenCookieOptions = ():CookieOptions => {
    return {
        ...defaults,
        expires:fifteenMinuteFromNow(),
    }
}

const getRefreshTokenCookieOptions = ():CookieOptions => {
    return {
        ...defaults,
        expires:thirtyDaysFromNow(),
        path:"/auth/refresh"
    }
}

type Params = {
    res:Response;
    accessToken:string;
    refreshToken:string;
}
export const setAuthCookies = ({res, accessToken, refreshToken}:Params) => {
    return res.cookie("accessToken", accessToken, getAccessTokenCookieOptions()).cookie("refreshToken",refreshToken, getRefreshTokenCookieOptions())
}