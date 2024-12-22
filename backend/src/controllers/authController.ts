import { z } from "zod";
import catchAsync from "../utils/catchErrors";
import { createAccount } from "../services/authService";
import { setAuthCookies } from "../utils/cookies";
import { CREATED } from "../constants/httpCode";

const registerSchema = z.object({
    email:z.string().email().min(1).max(255),
    password:z.string().min(6).max(255),
    confirmPassword:z.string().min(6).max(255),
    userAgent:z.string().optional(),
}).refine(
    (data) => {
        return data.password === data.confirmPassword
    },
    {
        message:"Password do not match",
        path:["confirmPassword"]
    }
)

export const registerHandler = catchAsync(
    async(req, res, next) => {
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