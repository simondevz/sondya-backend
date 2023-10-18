import auth from "../controllers/auth.controllers.js";

import Router from "express";
const authRoutes = Router.Router();

// Basic Auth
authRoutes.post("/register", auth.register);
authRoutes.post("/login", auth.login);
authRoutes.post("/forgot-password", auth.forgotPassword);
authRoutes.post("/verify-email/:email", auth.verifyEmailCode);
authRoutes.post("/reset-password/:email", auth.resetPassword);

export default authRoutes;
