import { CookieOptions, Response } from "express"
import { NODE_ENV } from "../constants/env";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

const REFRESH_PATH = "/auth/refresh";

const defaults:CookieOptions = {
    sameSite:"strict",
    httpOnly:true,
    secure:NODE_ENV !== 'development'
}

const getAccessTokenCookieOption = ():CookieOptions => {
    return {
        ...defaults,
        expires:fifteenMinutesFromNow(),
    }
} 

const getRefreshTokenCookieOption = ():CookieOptions => {
    return {
        ...defaults,
        expires:thirtyDaysFromNow(),
        path:REFRESH_PATH
    }
} 

type Params = {
    res:Response;
    accessToken:string;
    refreshToken:string;
}

export const setAuthCookies = ({res, accessToken, refreshToken}:Params) => {
    return res.cookie('accessToken', accessToken, getAccessTokenCookieOption()).cookie('refreshToken', refreshToken, getRefreshTokenCookieOption())
}

export const clearAuthCookie = (res:Response) => {
    return res.clearCookie("accessToken").clearCookie("refreshToken", {
        path:REFRESH_PATH
    })
}