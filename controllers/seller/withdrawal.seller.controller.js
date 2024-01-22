import asyncHandler from "express-async-handler";

import UserModel from "../../models/users.model.js";
import WithdrawalModel from "../../models/withdrawal.model.js";
import responseHandle from "../../utils/handleResponse.js";

const WithdrawalInfo = {};

WithdrawalInfo.makeWithrawal = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Withdrawal']
  const {
    withdrawal_amount,
    user,
    currency,
    withdrawal_mode,
    withdrawal_account,
  } = req.body;

  try {
    const userBalance = await UserModel.findOne({ _id: user.id });

    if (!userBalance) {
      res.status(400);
      throw new Error("User doesnt exist cant get user details");
    }

    if (withdrawal_amount > userBalance.balance) {
      res.status(400);
      throw new Error("Insufficient balance");
    }

    if (withdrawal_amount <= 0) {
      res.status(400);
      throw new Error("Invalid amount");
    }

    // userBalance.balance = userBalance.balance - withdrawal_amount;
    // const updateUserBalance = await userBalance.save();

    // if (!updateUserBalance) {
    //   res.status(400);
    //   throw new Error("could not update user balance");
    // }

    const newWithdrawal = await WithdrawalModel.create({
      withdrawal_amount: withdrawal_amount,
      user: user,
      withdrawal_status: "pending",
      currency: currency,
      withdrawal_mode: withdrawal_mode,
      withdrawal_account: withdrawal_account,
    });

    if (!newWithdrawal) {
      res.status(500);
      throw new Error("could not create new withdrawal");
    }

    responseHandle.successResponse(
      res,
      201,
      "Withdrawal created successfully.",
      newWithdrawal
    );
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

WithdrawalInfo.UserWithdrawals = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Withdrawal']
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const userWithdrawals = await WithdrawalModel.find({
      "user.id": req.params.id,
    })
      .skip((page - 1) * limit)
      .limit(limit);

    responseHandle.successResponse(
      res,
      200,
      "found withdrawals successfully.",
      userWithdrawals
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

WithdrawalInfo.UserWithdrawalByID = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Withdrawal']
  try {
    // const userWithdrawalByID = await WithdrawalModel.findone({
    //   "user.id": req.params.id,
    // });
    const userWithdrawalByID = await WithdrawalModel.findById(req.params.id);

    responseHandle.successResponse(
      res,
      200,
      "got withdrawal successfully.",
      userWithdrawalByID
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

WithdrawalInfo.UserDeleteWithdrawalByID = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Withdrawal']

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
});

WithdrawalInfo.getWithdrawalStat = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Withdrawal']

  const user_id = req.params.user_id;
  const checkUser = await UserModel.findById(user_id);
  try {
    if (!checkUser) {
      res.status(404);
      throw new Error("User not found");
    }

    const withdrawals = await WithdrawalModel.find({ "user.id": user_id });
    const withdrawalStat = {
      pending: 0,
      completed: 0,
    };

    withdrawals.forEach((withdrawal) => {
      if (withdrawal.withdrawal_status === "pending")
        withdrawalStat.pending += withdrawal.withdrawal_amount;
      if (withdrawal.withdrawal_status === "success")
        withdrawalStat.completed += withdrawal.withdrawal_amount;
    });

    if (!withdrawals) {
      res.status(500);
      throw new Error("could not get withdrawal stats");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "withdrawal ststs gotten successfully.",
        withdrawalStat
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default WithdrawalInfo;
