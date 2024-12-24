import catchAsync from "../utils/catchErrors";
import { createAccount, loginUser, refreshUserAccessToken, sendPasswordResetEmail, verifyEmail } from "../services/authService";
import { clearAuthCookie, getAccessTokenCookieOption, getRefreshTokenCookieOption, setAuthCookies } from "../utils/cookies";
import { CREATED, OK, UNAUTHORIZED } from "../constants/httpCode";
import { emailSchema, loginSchema, registerSchema, verificationCodeSchema } from "./authSchema";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/sessionModel";
import appAssert from "../utils/appAssert";



export const registerHandler = catchAsync(
    async(req, res) => {
        //validate request
        const request = registerSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"]
        });

        //call service
        const {user, accessToken, refreshToken} = await createAccount(request)
        //return response
        return setAuthCookies({res, accessToken, refreshToken})
        .status(CREATED).json(user)
    }
)


export const loginHandler = catchAsync(
    async(req, res) => {
        //validate request
        const request = loginSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"]
        });

        //call service
        const {user, accessToken, refreshToken} = await loginUser(request)
        //return response
        return setAuthCookies({res, accessToken, refreshToken})
        .status(CREATED).json({
            message:"login successfully"
        })
    }
)


export const logoutHandler = catchAsync(
    async (req, res) => {
        const accessToken = req.cookies.accessToken as string|undefined;
        const {payload} = verifyToken(accessToken || "")
        if(payload){
            await SessionModel.findByIdAndDelete(payload.sessionId)
        }

        return clearAuthCookie(res).status(OK).json({
            message:"Logout Successfully"
        })
    }
)

export const refreshHandler = catchAsync(
    async (req, res) => {
        const refreshToken = req.cookies.refreshToken as string|undefined;
        appAssert(refreshToken, UNAUTHORIZED, "Missing Refresh token");
        const  {accessToken, newRefreshToken} = await refreshUserAccessToken(refreshToken);
        if(newRefreshToken){
            res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOption())
        }

        return res.status(OK).cookie("accessToken", accessToken, getAccessTokenCookieOption()).json({
            message:"Access token refreshed"
        })
    }
)

export const verifyEmailHandler = catchAsync(
    async (req, res) => {
        const verificationCode = verificationCodeSchema.parse(req.params.code);
        await verifyEmail(verificationCode)
        return res.status(OK).json({
            message:"Email was successfully verified"
        })
    }
)

export const sendPasswordResetHandler = catchAsync(
    async (req, res) => {
        const email = emailSchema.parse(req.body.email);
        const {url} = await sendPasswordResetEmail(email);
        return res.status(OK).json({
            message:"Password rest link sent successfully",
            url
        })
    }
)