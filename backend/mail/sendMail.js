import nodemailer from 'nodemailer';
import 'dotenv/config'
import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplate.js';

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