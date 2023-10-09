import auth from "../controllers/auth.controllers.js";

import Router from "express";
const authRoutes = Router.Router();

// Basic Auth
authRoutes.post("/register", auth.register);
authRoutes.post("/login", auth.login);
// authRoutes.post("/forgotpassword", auth.Post);

export default authRoutes;
