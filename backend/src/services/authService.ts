import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT, UNAUTHORIZED } from "../constants/httpCode";
import VerificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/sessionModel";
import UserModel from "../models/userModel";
import VerificationCodeModel from "../models/verificationCodeModel";
import appAssert from "../utils/appAssert";
import { oneYearFromNow } from "../utils/date";
import jwt from 'jsonwebtoken';
import { refreshTokenSignOptions, signToken } from "../utils/jwt";

export type createAccountParams = {
    email:string;
    password:string;
    userAgent?:string;
}
export const createAccount = async (data:createAccountParams) => {
    //verify existing user does not exist
    const existingUser = await UserModel.exists({
        email:data.email
    })
    appAssert(!existingUser, CONFLICT, "User already in use");

    // if(existingUser){
    //     throw new Error("User already exist")
    // }
    //create user
    const user = await UserModel.create({
        email:data.email,
        password:data.password
    });

    //verification code
    const verificationCode = await VerificationCodeModel.create({
        userId:user._id,
        type:VerificationCodeType.EmailVerification,
        expiresAt:oneYearFromNow()
    })
    //send verification email

    //create session 
    const session =  await SessionModel.create({
        userId:user._id,
        userAgent: data.userAgent
    })

    //sign access token and refresh token
    const refreshToken = signToken(
        {
            sessionId:session._id
        },
        refreshTokenSignOptions
    )
    const accessToken = signToken(
        {
            userId:user._id,
            sessionId:session._id
        },
    )
    

    //return user and token
    return {
        user:user.omitPassword(),
        accessToken,
        refreshToken
    }
}

//login service

export type loginParams = {
    email:string;
    password:string;
    userAgent?:string;
}

export const loginUser = async ({email, password, userAgent}:loginParams) => {
    //get user by email
    const user = await UserModel.findOne({email});
    appAssert(user, UNAUTHORIZED, "Wrong Credentials")

    // validate password from the request
    const isValid = await user.comparePassword(password);
    appAssert(isValid, UNAUTHORIZED, "Wrong Credentials");

    const userId = user._id;
    //create a session 
    const session = await SessionModel.create({
        userId,
        userAgent
    })

    const sessionInfo = {
        sessionId: session._id,
    }
    
    //sign access token and refresh token
    const refreshToken = signToken(
        sessionInfo,
        refreshTokenSignOptions
    )
    const accessToken = signToken(
        {
            userId:user._id,
            sessionId:session._id
        },
    )
    
    //return user and tokens
    return {
        user:user.omitPassword(),
        accessToken,
        refreshToken
    }
}