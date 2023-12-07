import homeList from "../controllers/home.controller.js";

import Router from "express";
const homeRoutes = Router.Router();

//Basic home
homeRoutes.get("/products", homeList.getAllProducts);
homeRoutes.get("/services", homeList.getAllServices);
homeRoutes.get("/product/details/:id/:name", homeList.getProductById);
homeRoutes.get("/service/details/:id/:name", homeList.getServiceById);

export default homeRoutes;
