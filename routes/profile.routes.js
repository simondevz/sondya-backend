import upload from "../config/file.js";
import profile from "../controllers/profile.controllers.js";

import express from "express";
const profileRoutes = express.Router();

profileRoutes.put("/profile/update/:id", upload.array("image"), profile.update);
profileRoutes.get("/profile/get/:id", profile.getbyid);

export default profileRoutes;
