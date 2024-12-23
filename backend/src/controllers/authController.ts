import catchAsync from "../utils/catchErrors";
import { createAccount, loginUser } from "../services/authService";
import { clearAuthCookie, setAuthCookies } from "../utils/cookies";
import { CREATED, OK } from "../constants/httpCode";
import { loginSchema, registerSchema } from "./authSchema";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/sessionModel";



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
        const accessToken = req.cookies.accessToken;
        const {payload} = verifyToken(accessToken)
        if(payload){
            await SessionModel.findByIdAndDelete(payload.sessionId)
        }

        return clearAuthCookie(res).status(OK).json({
            message:"Logout Successfully"
        })
    }
)