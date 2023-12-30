import asyncHandler from "express-async-handler";

import UserModel from "../../models/users.model.js";
import WithdrawalModel from "../../models/withdrawal.model.js";
import responseHandle from "../../utils/handleResponse.js";

const AdminWithdrawalInfo = {};

AdminWithdrawalInfo.MakePayment = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Withdrawal']

  const checkWithdrawal = await WithdrawalModel.findById(req.params.id);
  const userBalance = await UserModel.findOne({ _id: checkWithdrawal.user.id });

  const { withdrawal_status, withdrawal_amount } = req.body;
  try {
    if (!checkWithdrawal) {
      res.status(404);
      throw new Error("Id not found");
    }

    if (withdrawal_amount > userBalance.balance) {
      res.status(400);
      throw new Error("Insufficient balance");
    }

    if (
      withdrawal_status === "success" &&
      checkWithdrawal.withdrawal_status === "pending"
    ) {
      userBalance.balance = userBalance.balance - withdrawal_amount;
      const updateUserBalance = await userBalance.save();
      if (!updateUserBalance) {
        res.status(400);
        throw new Error("could not update user balance");
      }
    }

    checkWithdrawal.withdrawal_status = withdrawal_status;
    checkWithdrawal.withdrawal_amount = withdrawal_amount;
    const updateWithdrawal = await checkWithdrawal.save();

    if (!updateWithdrawal) {
      res.status(400);
      throw new Error("could not update withdrawal");
    }

    responseHandle.successResponse(
      res,
      "200",
      "Withdrawal updated successfully",
      updateWithdrawal
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AdminWithdrawalInfo.getWithdrawalHistory = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Withdrawal']

  try {
    const searchRegex = new RegExp(req.query.search, "i");
    const statusRegex = new RegExp(req.query.status, "i");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const userWithdrawals = await WithdrawalModel.find({
      $and: [
        { withdrawal_status: { $regex: statusRegex } },
        {
          $or: [
            { "user.username": { $regex: searchRegex } },
            { "user.email": { $regex: searchRegex } },
          ],
        },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await WithdrawalModel.countDocuments({
      $or: [
        { "user.username": { $regex: searchRegex } },
        { "user.email": { $regex: searchRegex } },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit);

    responseHandle.successResponse(
      res,
      200,
      "found withdrawals successfully.",
      {
        data: userWithdrawals,
        count: total,
      }
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AdminWithdrawalInfo.getPendingWithdrawals = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Withdrawal']

  try {
    const searchRegex = new RegExp(req.query.search, "i");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const userWithdrawals = await WithdrawalModel.find({
      $and: [
        { withdrawal_status: "pending" },
        {
          $or: [
            { "user.username": { $regex: searchRegex } },
            { "user.email": { $regex: searchRegex } },
          ],
        },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await WithdrawalModel.countDocuments({
      $and: [
        { withdrawal_status: "pending" },
        {
          $or: [
            { "user.username": { $regex: searchRegex } },
            { "user.email": { $regex: searchRegex } },
          ],
        },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit);

    responseHandle.successResponse(
      res,
      200,
      "found pending withdrawals successfully.",
      {
        data: userWithdrawals,
        count: total,
      }
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AdminWithdrawalInfo.AdminWithdrawalByID = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Withdrawal']
  try {
    const AdminWithdrawalByID = await WithdrawalModel.findById(req.params.id);

    responseHandle.successResponse(
      res,
      200,
      "got withdrawal successfully.",
      AdminWithdrawalByID
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AdminWithdrawalInfo.AdminDeleteWithdrawalByID = asyncHandler(
  async (req, res) => {
    // #swagger.tags = ['Admin Withdrawal']

    const checkWithdrawal = await WithdrawalModel.findById(req.params.id);
    try {
      if (!checkWithdrawal) {
        res.status(404);
        throw new Error("Id not found");
      }

      if (checkWithdrawal.withdrawal_status !== "pending") {
        res.status(400);
        throw new Error("Withdrawal already processed and can not be deleted.");
      }

      const deleteWithdrawal = await WithdrawalModel.findByIdAndDelete(
        req.params.id
      );

      if (!deleteWithdrawal) {
        res.status(500);
        throw new Error("could not delete withdrawal");
      } else {
        responseHandle.successResponse(
          res,
          200,
          "withdrawal deleted successfully.",
          "withdrawal deleted"
        );
      }
    } catch (error) {
      res.status(500);
      throw new Error(error);
    }
  }
);

export default AdminWithdrawalInfo;
