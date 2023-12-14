import Order from "../../controllers/user/order.controllers.js";

import express from "express";
const orderRoutes = express.Router();

orderRoutes.post("/user/order/products/create", Order.createProductOrder);
orderRoutes.get("/user/order/products/:userId", Order.getProductsOrder);
orderRoutes.get("/user/order/products/details/:id", Order.getProductOrderById);

//for payment order
orderRoutes.get("/user/order/payments/:userId", Order.getProductsPaymentsOrder);
orderRoutes.get("/user/order/payments/:id", Order.getProductPaymentsOrderById);

export default orderRoutes;
