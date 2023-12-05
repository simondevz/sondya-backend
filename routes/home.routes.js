import homeList from "../controllers/home.controller.js";

import Router from "express";
const homeRoutes = Router.Router();

//Basic home
homeRoutes.get("/products", homeList.getAllProducts);
homeRoutes.get("/services", homeList.getAllServices);
homeRoutes.get("/categories", homeList.getAllCategories);

export default homeRoutes;
