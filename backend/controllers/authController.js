import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mail/sendMail.js";

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
        res.status(201).json({
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
export const login = async(req, res, next) => {
    res.send("login Route");
}
export const logout = async(req, res, next) => {
    res.send("logout Route");
}