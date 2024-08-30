import nodemailer from 'nodemailer';
import 'dotenv/config'
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from './emailTemplate.js';

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port:process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASS
            }
        })
        
        const mailOptions = {
            from:`${process.env.MAIL_HOST}`,
            to: `${email}`,
            subject: `Verify Your Email`,
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                throw new Error(`Error While sending Mail` )
            } else {
                console.log(info.response, " Email sent");
            }
        })
    } catch (error) {
        throw new Error(`Error While sending Mail ${error.message}` )
        console.log(error);
    }
}


export const sendWelcomeEmail = async (name, email) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port:process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASS
            }
        })
        
        const mailOptions = {
            from:`${process.env.MAIL_HOST}`,
            to: `${email}`,
            subject: `Welcome ${name} to the Company`,
            text:`Your this email: ${email} is verified`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                throw new Error(`Error While sending Mail` )
            } else {
                console.log(info.response, " Email sent");
            }
        })
    } catch (error) {
        throw new Error(`Error While sending Mail ${error.message}` )
        console.log(error);
    }
}

export const sendPasswordResetEmail = async (email, resetTokenUrl) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port:process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASS
            }
        })
        
        const mailOptions = {
            from:`${process.env.MAIL_HOST}`,
            to: `${email}`,
            subject: `Reset your password`,
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetTokenUrl)
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                throw new Error(`Error While sending Mail` )
            } else {
                console.log(info.response, " Email sent");
            }
        })
    } catch (error) {
        throw new Error(`Error While sending Mail ${error.message}` )
        console.log(error);
    }
}

export const sendResetSuccessEmail = async (email) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port:process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASS
            }
        })
        
        const mailOptions = {
            from:`${process.env.MAIL_HOST}`,
            to: `${email}`,
            subject: `Password reset successfully`,
            html:PASSWORD_RESET_SUCCESS_TEMPLATE
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                throw new Error(`Error While sending Mail` )
            } else {
                console.log(info.response, " Email sent");
            }
        })
    } catch (error) {
        throw new Error(`Error While sending Mail ${error.message}` )
        console.log(error);
    }
}