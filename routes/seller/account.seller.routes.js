import express from "express";
const SellerAccountRoutes = express.Router();

import AccountInfo from "../../controllers/seller/account.seller.controller.js";

// top up account
SellerAccountRoutes.put("/account/topup/:id", AccountInfo.SellerTopUpAccount);

// get account balance and details
SellerAccountRoutes.get("/account/balance/:id", AccountInfo.GetUserBalalce);

//adding accounts to profile
SellerAccountRoutes.put("/account/bank/add/:id", AccountInfo.AddBankAccount);

// delete bank account
SellerAccountRoutes.delete(
  "/account/bank/delete/:userId/:id",
  AccountInfo.DeleteBankAccount
);

// add paypal account
SellerAccountRoutes.put(
  "/account/paypal/add/:id",
  AccountInfo.AddPayPalAccount
);

// delete paypal account
SellerAccountRoutes.delete(
  "/account/paypal/delete/:userId/:id",
  AccountInfo.DeletePaypalAccount
);

// add payoneer account
SellerAccountRoutes.put(
  "/account/payoneer/add/:id",
  AccountInfo.AddPayoneerAccount
);

// delete payoneer account
SellerAccountRoutes.delete(
  "/account/payoneer/delete/:userId/:id",
  AccountInfo.DeletePayoneer
);

export default SellerAccountRoutes;
