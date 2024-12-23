import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { SessionDocument } from "../models/sessionModel"
import { UserDocument } from "../models/userModel";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";

export type RefreshTokenPayload = {
    sessionId:SessionDocument["_id"];
}

export type AccessTokenPayload = {
    userId:UserDocument["_id"];
    sessionId:SessionDocument["_id"];
}
    

const defaults:SignOptions = {
    audience:["user"],
}
 
type SignOptionsAndSecret = SignOptions & {
    secret:string;
}
  
const accessTokenSignOptions:SignOptionsAndSecret = {
    expiresIn:"15m",
    secret:JWT_SECRET
}

export const refreshTokenSignOptions:SignOptionsAndSecret = {
    expiresIn:"30d",
    secret:JWT_REFRESH_SECRET
}

export const signToken = (
    payload: AccessTokenPayload | RefreshTokenPayload,
    options?:SignOptionsAndSecret
) => {
    const {secret, ...signOpts} = options || accessTokenSignOptions;
    return jwt.sign(payload,secret, {
        ...defaults,
        ...signOpts,
    })
}


export const verifyToken = <TPaload extends object = AccessTokenPayload >(
    token:string,
    options?:VerifyOptions & {secret:string}
) => {
    const {secret = JWT_SECRET, ...verifyOpts} = options || {};
    try {
        const payload = jwt.verify(token, secret, {
            ...defaults,
            ...verifyOpts
        }) as TPaload

        return {
            payload
        }
    } catch (error:any) {
        return{
            error:error.message
        }
    }

}