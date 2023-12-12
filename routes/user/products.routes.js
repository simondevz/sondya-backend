import userProducts from "../../controllers/user/products.controllers.js";

import express from "express";
const productsRoutes = express.Router();

productsRoutes.get("/user/products", userProducts.getProducts);
productsRoutes.get("/user/product/:id", userProducts.getProductById);
productsRoutes.get("/user/products/categories", userProducts.getCategories);

export default productsRoutes;
