import user from "../controllers/user.controllers.js";

import express from "express";
const userRoutes = express.Router();

userRoutes.post("/register/user", user.register);
// userRoutes.post("/login/user", user.login);
// userRoutes.post("/login/user", user.login);

export default userRoutes;
