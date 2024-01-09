import AdminOrder from "../../controllers/admin/admin-order.controllers.js";

import express from "express";
const AdminOrderRoutes = express.Router();

// for admin products order
AdminOrderRoutes.get("/admin/order/products", AdminOrder.AdminGetProductsOrder);
AdminOrderRoutes.get(
  "/admin/order/product/:id",
  AdminOrder.AdminGetProductOrderById
);
AdminOrderRoutes.delete(
  "/admin/order/products/:id",
  AdminOrder.AdmindeleteProductOrder
);

AdminOrderRoutes.get("/admin/order/service", AdminOrder.AdminGetServiceOrder);
AdminOrderRoutes.get(
  "/admin/order/service/:id",
  AdminOrder.AdminGetServiceOrderById
);
AdminOrderRoutes.delete(
  "/admin/order/service/:id",
  AdminOrder.AdmindeleteServiceOrder
);

// get user orders
AdminOrderRoutes.get("/admin/order/user/:id", AdminOrder.AdminGetUserOrders);

export default AdminOrderRoutes;
