import { Router } from "express";
import { loginHandler, logoutHandler, refreshHandler, registerHandler, resetPasswordHandler, sendPasswordResetHandler, verifyEmailHandler } from "../controllers/authController";

const authRoutes = Router();

authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.get('/logout', logoutHandler);
authRoutes.get('/refresh', refreshHandler);
authRoutes.get('/email/verify/:code', verifyEmailHandler);
authRoutes.post('/password/forgot', sendPasswordResetHandler);
authRoutes.post('/password/reset', resetPasswordHandler);

export default authRoutes;