import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT } from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { oneYearFromNow } from "../utils/date";
import jwt from 'jsonwebtoken';

export type CreateAccountParams = {
    email:string;
    password:string;
    userAgent?:string;
}

export const createAccount = async (data:CreateAccountParams) => {
    // verify exisiting user does not exist
    const existingUser = await UserModel.exists({
        email:data.email
    });
    appAssert(!existingUser, CONFLICT, "Email Already in use")

    // if(existingUser){
    //     throw new Error("User already exists")
    // }
    //create the user
    const user = await UserModel.create({
        email:data.email,
        password:data.password,
    });
    // create verification token
    const verificationCode = await VerificationCodeModel.create({
        userId: user._id,
        type:VerificationCodeType.EmailVerification,
        expiresAt:oneYearFromNow()
    }) 
    // create session 
    const session = await SessionModel.create({
        userId:user._id,
        userAgent: data.userAgent
    })
    //sign access token and refresh token
    const refreshToken = jwt.sign(
        {
            sessionId:session._id,
        },
        JWT_REFRESH_SECRET,
        {
            expiresIn:"30d",
            audience:["user"]
        }
    )
    const accessToken = jwt.sign(
        {
            userId:user._id,
            sessionId:session._id,
        },
        JWT_SECRET,
        {
            expiresIn:"15m",
            audience:["user"]
        }
    )

    //return new user and access token 
    return {user:user.omitPassword(), accessToken, refreshToken}
}