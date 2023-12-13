import Order from "../../controllers/user/order.controllers.js";

import express from "express";
const orderRoutes = express.Router();

orderRoutes.post("/user/order/products/create", Order.createProductOrder);
orderRoutes.get("/user/order/products", Order.getProductsOrder);
orderRoutes.get("/user/order/products/:id", Order.getProductOrderById);

export default orderRoutes;
