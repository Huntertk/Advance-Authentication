import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mail/sendMail.js";

export const signup = async(req, res, next) => {
    const {email, name, password} = req.body;
    
    try {
        if(!email || !password || !name){
            throw new Error("All fields are required")
        }

        const userAlreadyExist = await User.findOne({email})
        if(userAlreadyExist){
            return res.status(400).json({
                success:false,
                message:"User Already Exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiredAt:Date.now() + 1000 * 60 * 60 * 24 //24 Hours
        })

        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id);

        //sendVerification Email
        await sendVerificationEmail(user.email, verificationToken)
        
        //sending response
        return res.status(201).json({
            success:true,
            message:"User created successfully",
            user:{
                ...user._doc,
                password:undefined
            }
        })

    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}


export const verifyEmail = async(req, res, next) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpiredAt: {$gt: Date.now()}
        })

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid code or expired verification code"
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiredAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.name, user.email);
        return res.status(200).json({
            success:true,
            message:"User email is verified"
        });

        
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}


export const login = async(req, res, next) => {
    const {email, password} = req.body;
    try {
        
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            })
        }
        
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            })
        }

        generateTokenAndSetCookie(res,user._id);
        user.lastLogin = Date.now();
        await user.save();

        //sending response
        return res.status(200).json({
            success:true,
            message:"User login successfully",
            user:{
                ...user._doc,
                password:undefined
            }
        })



    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
export const logout = async(req, res, next) => {
    res.clearCookie('token');
    return res.status(200).json({
        success:true,
        message:"User logout successfully"
    })
}


export const forgotPassword = async (req, res, next) => {
    const {email} = req.body;
    try {        
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found with email"
            })
        }
        
        //generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1000*60*15;
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiredAt = resetTokenExpiresAt;
        await user.save();

        //send email

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-token/${resetToken}`);
        return res.status(200).json({
            success:true,
            message:"Passoword reset link is sent to your email"
        })

    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        if(!password){
            return res.status(400).json({
                success:false,
                message:"Please enter your password to proceed"
            })
        }
        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpiredAt:{$gt:Date.now()}
        })
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Passoword reset token invalid or link is expired"
            })
        }        
        //Hashing Pass
        const hashedPassword = await bcrypt.hash(password, 10);

        
        //Updating User
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiredAt = undefined;

        //Saving User
        await user.save();

        //Sending Mail
        await sendResetSuccessEmail(user.email)

        return res.status(200).json({
            success:true,
            message:"Passoword reset successfully"
        })

    } catch (error) {
        console.log(error);
        
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
