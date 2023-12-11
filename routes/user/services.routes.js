import express from "express";
import userServices from "../../controllers/user/services.controllers.js";

const ServicesRoutes = express.Router();

ServicesRoutes.get("/user/services", userServices.getServices);
ServicesRoutes.get("/user/service/:id", userServices.getServiceById);
ServicesRoutes.get("/user/services/categories", userServices.getCategories);

export default ServicesRoutes;
