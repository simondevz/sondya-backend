import PaymentOrder from "../../controllers/user/payments.controllers.js";

import express from "express";
const PaymentOrderRoutes = express.Router();

//for payment order
PaymentOrderRoutes.post("/user/payments/pay", PaymentOrder.Pay);

PaymentOrderRoutes.get("/user/payments/verify/:tx_ref", PaymentOrder.Verify);

PaymentOrderRoutes.get(
  "/user/payments/:userId",
  PaymentOrder.getProductsPaymentsOrder
);
PaymentOrderRoutes.get(
  "/user/payments/details/:id",
  PaymentOrder.getProductPaymentsOrderById
);

export default PaymentOrderRoutes;
