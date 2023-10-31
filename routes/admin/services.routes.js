import adminServices from "../../controllers/admin/admin-services.controllers.js";

import express from "express";
const AdminServicesRoutes = express.Router();

// for admin services
AdminServicesRoutes.post("/admin/service/create", adminServices.create);
AdminServicesRoutes.put("/admin/service/update/:id", adminServices.update);
AdminServicesRoutes.get("/admin/service/:id", adminServices.getById);
AdminServicesRoutes.delete("/admin/service/:id", adminServices.delete);
AdminServicesRoutes.get("/admin/services", adminServices.getAll);

export default AdminServicesRoutes;
