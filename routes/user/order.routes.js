import Order from "../../controllers/user/order.controllers.js";

import express from "express";
const orderRoutes = express.Router();

orderRoutes.post("/user/order/products/create", Order.createProductOrder);
orderRoutes.get("/user/order/products/:userId", Order.getProductsOrder);
orderRoutes.get("/user/order/products/details/:id", Order.getProductOrderById);
orderRoutes.get("/user/order/services/:order_id", Order.getServiceOrderById);
orderRoutes.post(
  "/user/order/services/create/:service_id",
  Order.createServiceOrder
);
orderRoutes.put(
  "/user/order/services/updateterms/:order_id",
  Order.updateServiceOrderTerms
);
orderRoutes.put(
  "/user/order/services/update/:order_id",
  Order.updateServiceOrder
);
orderRoutes.get(
  "/user/order/services/list/:buyer_id",
  Order.getServiceOrdersBuyer
);

export default orderRoutes;
