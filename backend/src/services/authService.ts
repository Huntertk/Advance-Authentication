import { APP_ORIGIN, JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUESTS, UNAUTHORIZED } from "../constants/httpCode";
import VerificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/sessionModel";
import UserModel from "../models/userModel";
import VerificationCodeModel from "../models/verificationCodeModel";
import appAssert from "../utils/appAssert";
import { fiveMinutesAgo, ONE_DAY_MS, oneHourFromNow, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import jwt from 'jsonwebtoken';
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";


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


export const refreshUserAccessToken = async (refreshToken:string) => {
    const now = Date.now();
    const {payload} = verifyToken<RefreshTokenPayload>(refreshToken, {
        secret:refreshTokenSignOptions.secret,
    })
    appAssert(payload, UNAUTHORIZED, "Invalid refresh token");
    
    const session = await SessionModel.findById(payload.sessionId);

    appAssert(session && session.expiresAt.getTime() > now, UNAUTHORIZED, "Session expired")

    //refresh the session if it is expires in the next 24 hours
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS; 
    if(sessionNeedsRefresh){
        session.expiresAt = thirtyDaysFromNow();
        await session.save();
    }

    const newRefreshToken = sessionNeedsRefresh ? signToken({sessionId:session._id}, refreshTokenSignOptions) : undefined

    const accessToken = signToken({
        userId:session.userId,
        sessionId:session._id,
    });

    return {
        accessToken, 
        newRefreshToken
    }
}


export const verifyEmail = async(code:string) => {
    //get the verification code
    const validCode = await VerificationCodeModel.findOne({
        _id:code,
        type:VerificationCodeType.EmailVerification,
        expiresAt: {$gt:new Date()}
    })

    appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

    //get user by id and update user
    const updatedUser = await UserModel.findByIdAndUpdate(
        validCode.userId,
        {
            verified: true
        },
        {
            new: true
        }
    )

    appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");

    //delete the verification code
    await validCode.deleteOne();
    //return the user
    return {
        user:updatedUser.omitPassword()
    }
}


export const sendPasswordResetEmail = async (email:string) => {
    //get the user
    const user = await UserModel.findOne({email})
    appAssert(user, NOT_FOUND, "User not found");

    //check the email rate limit
    const fiveMinAgo = fiveMinutesAgo();  
    const count = await VerificationCodeModel.countDocuments({
        userId:user._id,
        type:VerificationCodeType.PasswordReset,
        createdAt:{$gt: fiveMinAgo}
    })

    appAssert(count <= 1, TOO_MANY_REQUESTS, "Too many request, try again later");

    //create verification code
    const expiresAt = oneHourFromNow();
    const verificationCode = await VerificationCodeModel.create({
        userId: user._id,
        type:VerificationCodeType.PasswordReset,
        expiresAt
    })
    //send verification email
    const url = `${APP_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expiresAt.getTime()}`

    //return success
    return {
        url
    }
}