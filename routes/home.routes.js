import homeList from "../controllers/home.controller.js";
import userProducts from "../controllers/user/products.controllers.js";
import userServices from "../controllers/user/services.controllers.js";

import Router from "express";
const homeRoutes = Router.Router();

//Basic home
homeRoutes.get("/products", homeList.getAllProducts);
homeRoutes.get("/services", homeList.getAllServices);
homeRoutes.get("/product/details/:id/:name", homeList.getProductById);
homeRoutes.get("/service/details/:id/:name", homeList.getServiceById);

//get categories
homeRoutes.get("/products/categories", userProducts.getCategories);
homeRoutes.get("/services/categories", userServices.getCategories);

export default homeRoutes;
