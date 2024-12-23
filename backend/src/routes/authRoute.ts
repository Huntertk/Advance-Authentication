import { Router } from "express";
import { loginHandler, logoutHandler, refreshHandler, registerHandler } from "../controllers/authController";

const authRoutes = Router();

authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.get('/logout', logoutHandler);
authRoutes.get('/refresh', refreshHandler);

export default authRoutes;