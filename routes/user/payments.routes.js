import PaymentOrder from "../../controllers/user/payments.controllers.js";

import express from "express";
const PaymentOrderRoutes = express.Router();

//for payment order
PaymentOrderRoutes.get(
  "/user/payments/:userId",
  PaymentOrder.getProductsPaymentsOrder
);
PaymentOrderRoutes.get(
  "/user/payments/details/:id",
  PaymentOrder.getProductPaymentsOrderById
);

export default PaymentOrderRoutes;
