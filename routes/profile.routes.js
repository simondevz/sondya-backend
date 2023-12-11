import upload from "../config/file.js";
import profile from "../controllers/profile.controllers.js";

import express from "express";
const profileRoutes = express.Router();

profileRoutes.get("/profile/get/:id", profile.getbyid);
profileRoutes.put("/profile/update/:id", upload.array("image"), profile.update);
profileRoutes.put("/profile/update/password/:id", profile.changePassword);
profileRoutes.put("/profile/update/socials/:id", profile.updateSocialMedia);
profileRoutes.put("/profile/update/company/:id", profile.updateCompanyDetails);

export default profileRoutes;
