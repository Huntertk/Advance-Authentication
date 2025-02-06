import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser } from "../services/auth.service";
import { CREATED, OK } from "../constants/http";
import { setAuthCookies } from "../utils/cookies";
import { loginSchema, registerSchema } from "./auth.schemas";
import { allowedNodeEnvironmentFlags } from "process";


export const registerHandler = catchErrors (
    async (req, res) => {
        //validate register
        const request = registerSchema.parse({
            ...req.body,
            userAgent:req.headers["user-agent"]
        })
        //call service
        const {accessToken, refreshToken, user} = await createAccount(request)

        //return response
        return setAuthCookies({res, accessToken, refreshToken}).status(CREATED).json(user)
    }
)

export const loginHandler = catchErrors(
    async (req, res, next) => {
        const request = loginSchema.parse({...req.body, userAgent:req.headers["user-agent"]}); 
        const {accessToken, refreshToken, user} = await loginUser(request);
       //return response
       return setAuthCookies({res, accessToken, refreshToken}).status(OK).json({
        message:"Login Successfully"
       })
    }
)