import AdminOrderPayments from "../../controllers/admin/admin-payments.controllers.js";

import express from "express";
const AdminPaymentOrderRoutes = express.Router();

//for admin payment order
AdminPaymentOrderRoutes.get(
  "/admin/payments",
  AdminOrderPayments.getProductsPaymentsOrder
);
AdminPaymentOrderRoutes.get(
  "/admin/payments/details/:id",
  AdminOrderPayments.getProductPaymentsOrderById
);

export default AdminPaymentOrderRoutes;
