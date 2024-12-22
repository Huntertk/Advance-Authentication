import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT } from "../constants/httpCode";
import VerificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/sessionModel";
import UserModel from "../models/userModel";
import VerificationCodeModel from "../models/verificationCodeModel";
import appAssert from "../utils/appAssert";
import { oneYearFromNow } from "../utils/date";
import jwt from 'jsonwebtoken';

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
    const refreshToken = jwt.sign(
        {
            sessionId:session._id
        },
        JWT_REFRESH_SECRET,
        {
            audience:["user"],
            expiresIn:"30d"
        }
    )
    const accessToken = jwt.sign(
        {
            usesrId:user._id,
            sessionId:session._id
        },
        JWT_SECRET,
        {
            audience:["user"],
            expiresIn:"15m"
        }
    )

    //return user and token
    return {
        user:user.omitPassword(),
        accessToken,
        refreshToken
    }
}