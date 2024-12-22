import catchAsync from "../utils/catchErrors";
import { createAccount, loginUser } from "../services/authService";
import { setAuthCookies } from "../utils/cookies";
import { CREATED } from "../constants/httpCode";
import { loginSchema, registerSchema } from "./authSchema";



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