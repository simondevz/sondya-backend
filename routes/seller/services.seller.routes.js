import upload from "../../config/file.js";
import SellerServices from "../../controllers/seller/services.seller.controller.js";

import express from "express";
const SellerServicesRoutes = express.Router();

// for seller services
SellerServicesRoutes.post(
  "/seller/service/create",
  upload.array("image"),
  SellerServices.create
);
SellerServicesRoutes.put(
  "/seller/service/update/:id",
  upload.array("image"),
  SellerServices.update
);
SellerServicesRoutes.get("/seller/service/:userId/:id", SellerServices.getById);
SellerServicesRoutes.delete("/seller/service/:id", SellerServices.delete);
SellerServicesRoutes.get("/seller/services", SellerServices.getAll);

export default SellerServicesRoutes;
