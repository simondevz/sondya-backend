import WithdrawalInfo from "../../controllers/seller/withdrawal.seller.controller.js";

import express from "express";
const SellerWithdrawalRoutes = express.Router();

// for seller withdrawal
SellerWithdrawalRoutes.post("/seller/withdraw", WithdrawalInfo.makeWithrawal);
SellerWithdrawalRoutes.get(
  "/seller/withdrawals/:id",
  WithdrawalInfo.UserWithdrawals
);
SellerWithdrawalRoutes.get(
  "/seller/withdrawal/details/:id",
  WithdrawalInfo.UserWithdrawalByID
);
SellerWithdrawalRoutes.delete(
  "/seller/withdrawal/delete/:id",
  WithdrawalInfo.UserDeleteWithdrawalByID
);

export default SellerWithdrawalRoutes;
