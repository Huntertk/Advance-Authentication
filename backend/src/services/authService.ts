import VerificationCodeType from "../constants/verificationCodeType";
import UserModel from "../models/userModel";
import VerificationCodeModel from "../models/verificationCodeModel";
import { oneYearFromNow } from "../utils/date";

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

    if(existingUser){
        throw new Error("User already exist")
    }
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
    

    //sign access token and refresh token
    //return user and token

}