import upload from "../../config/file.js";
import adminServices from "../../controllers/admin/admin-services.controllers.js";

import express from "express";
const AdminServicesRoutes = express.Router();

// for admin services
AdminServicesRoutes.post(
  "/admin/service/create",
  upload.array("image"),
  adminServices.create
);
AdminServicesRoutes.put(
  "/admin/service/update/:id",
  upload.array("image"),
  adminServices.update
);
AdminServicesRoutes.get("/admin/service/:id", adminServices.getById);
AdminServicesRoutes.delete("/admin/service/:id", adminServices.delete);
AdminServicesRoutes.get("/admin/services", adminServices.getAll);

export default AdminServicesRoutes;
