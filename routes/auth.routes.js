import auth from "../controllers/auth.controllers";

import Router from "express";
const authRoutes = Router.Router();

// Basic Auth
authRoutes.post("/register", auth.Post);
authRoutes.post("/login", auth.Post);
authRoutes.post("/forgotpassword", auth.Post);

export default authRoutes;
