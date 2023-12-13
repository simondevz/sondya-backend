import AdminOrder from "../../controllers/admin/admin-order.controllers.js";

import express from "express";
const AdminOrderRoutes = express.Router();

// for admin products order
AdminOrderRoutes.get("/admin/order/products", AdminOrder.AdminGetProductsOrder);
AdminOrderRoutes.get(
  "/admin/order/product/:id",
  AdminOrder.AdminGetProductOrderById
);

export default AdminOrderRoutes;
