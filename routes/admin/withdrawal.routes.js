import AdminWithdrawalInfo from "../../controllers/admin/admin-withdrawals.controller.js";

import express from "express";
const AdminWithdrawalRoutes = express.Router();

// for admin withdrawal
AdminWithdrawalRoutes.post(
  "/admin/withdraw/:id",
  AdminWithdrawalInfo.MakePayment
);
AdminWithdrawalRoutes.get(
  "/admin/withdrawals",
  AdminWithdrawalInfo.getWithdrawalHistory
);

AdminWithdrawalRoutes.get(
  "/admin/withdrawals/pending",
  AdminWithdrawalInfo.getPendingWithdrawals
);
AdminWithdrawalRoutes.get(
  "/admin/withdrawal/details/:id",
  AdminWithdrawalInfo.AdminWithdrawalByID
);
AdminWithdrawalRoutes.delete(
  "/admin/withdrawal/delete/:id",
  AdminWithdrawalInfo.AdminDeleteWithdrawalByID
);

export default AdminWithdrawalRoutes;
