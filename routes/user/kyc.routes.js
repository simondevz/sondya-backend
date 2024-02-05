import upload from "../../config/file.js";
import kyc from "../../controllers/user/kyc.controllers.js";

import express from "express";
const kycRoutes = express.Router();

kycRoutes.post("/kyc/verify/email", kyc.verifyEmail);
kycRoutes.put("/kyc/verify/code/:id", kyc.verifyCode);
kycRoutes.put("/kyc/personal/:id", kyc.updatePersonalInfo);
kycRoutes.put("/kyc/contact/:id", kyc.updateContactInfo);
kycRoutes.put("/kyc/company/:id", kyc.updateCompanyDetails);
kycRoutes.put(
  "/kyc/document/:id",
  upload.array("image"),
  kyc.updateIdentificationDoc
);
kycRoutes.put("/kyc/image/:id", upload.array("image"), kyc.updateProfileDp);

export default kycRoutes;
