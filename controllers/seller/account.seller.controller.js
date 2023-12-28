import asyncHandler from "express-async-handler";

import UserModel from "../../models/users.model.js";
// import WithdrawalModel from "../../models/withdrawal.model.js";
import randomstring from "randomstring";
import responseHandle from "../../utils/handleResponse.js";

const AccountInfo = {};

AccountInfo.SellerTopUpAccount = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Account info']

  const check = await UserModel.findById(req.params.id).select(
    "balance bank_account paypal_account payoneer_account"
  );

  const { amount } = req.body;
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id does not exits");
    }

    check.balance = check.balance + amount;
    console.log(check.balance);
    const updateAmount = await check.save();
    if (!updateAmount) {
      res.status(400);
      throw new Error("could not add money to account");
    }

    responseHandle.successResponse(
      res,
      200,
      "account gotten successfully.",
      check
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AccountInfo.GetUserBalalce = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Account info']

  const SellerGetAccountInfo = await UserModel.findById(req.params.id).select(
    "balance bank_account paypal_account payoneer_account"
  );
  try {
    if (!SellerGetAccountInfo) {
      res.status(404);
      throw new Error("error getting balance");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "account gotten successfully.",
        SellerGetAccountInfo
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AccountInfo.AddBankAccount = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Account info']

  const check = await UserModel.findById(req.params.id);
  const { account_name, account_number, bank_name, routing_number } = req.body;
  try {
    if (!check) {
      res.status(400);
      throw new Error("Id not found");
    }

    if (!account_name || !account_number || !bank_name) {
      res.status(404);
      throw new Error("All fields are required");
    }

    if (
      check.bank_account.filter(
        (account) => account.account_number === account_number
      ).length > 0
    ) {
      res.status(400);
      throw new Error("account number already exists");
    }

    const account_id = randomstring.generate({
      length: 8,
      charset: "numeric",
    });

    const bank_account = {
      account_id: account_id,
      account_name: account_name,
      account_number: account_number,
      bank_name: bank_name,
      routing_number: routing_number,
    };

    check.bank_account = [...check.bank_account, bank_account];
    const updateAccount = await check.save();
    if (!updateAccount) {
      res.status(400);
      throw new Error("could not update bank account");
    }

    responseHandle.successResponse(
      res,
      "200",
      "bank account added successfully",
      check.bank_account.filter((account) => account.account_id === account_id)
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AccountInfo.AddPayPalAccount = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Account info']

  const check = await UserModel.findById(req.params.id);

  const { email } = req.body;
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    if (!email) {
      res.status(404);
      throw new Error("All fields are required");
    }

    if (
      check.paypal_account.filter((account) => account.email === email).length >
      0
    ) {
      res.status(400);
      throw new Error("email already exists");
    }

    if (check.paypal_account.length >= 1) {
      res.status(400);
      throw new Error(
        "paypal account limit reached, delete one to add another"
      );
    }

    const paypal_id = randomstring.generate({
      length: 8,
      charset: "numeric",
    });

    const paypal_account = {
      paypal_id: paypal_id,
      email: email,
    };

    check.paypal_account = [paypal_account];
    const updateAccount = await check.save();
    if (!updateAccount) {
      res.status(400);
      throw new Error("could not update paypal account");
    }

    responseHandle.successResponse(
      res,
      "200",
      "paypal account added successfully",
      check.paypal_account.filter((account) => account.paypal_id === paypal_id)
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AccountInfo.AddPayoneerAccount = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Account info']

  const check = await UserModel.findById(req.params.id);

  const { email } = req.body;
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    if (!email) {
      res.status(404);
      throw new Error("All fields are required");
    }

    if (
      check.payoneer_account.filter((account) => account.email === email)
        .length > 0
    ) {
      res.status(400);
      throw new Error("email already exists");
    }

    if (check.payoneer_account.length >= 1) {
      res.status(400);
      throw new Error(
        "payoneer account limit reached, delete one to add another"
      );
    }

    const payoneer_id = randomstring.generate({
      length: 8,
      charset: "numeric",
    });

    const payoneer_account = {
      payoneer_id: payoneer_id,
      email: email,
    };

    check.payoneer_account = [payoneer_account];
    const updateAccount = await check.save();

    if (!updateAccount) {
      res.status(400);
      throw new Error("could not update payoneer account");
    }

    responseHandle.successResponse(
      res,
      "200",
      "payoneer account updated successfully",
      check.payoneer_account.filter(
        (account) => account.payoneer_id === payoneer_id
      )
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// delete bank account
AccountInfo.DeleteBankAccount = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Account info']

  const check = await UserModel.findById(req.params.userId);

  try {
    if (!check) {
      res.status(400);
      throw new Error("Id not found");
    }

    if (
      check.bank_account.filter(
        (account) => account.account_id === req.params.id
      ).length > 0
    ) {
      // Find the index of the item with the requested account_id
      const indexToRemove = check.bank_account.findIndex(
        (account) => account.account_id === req.params.id
      );
      check.bank_account.splice(indexToRemove, 1);

      const updateAccount = await check.save();
      if (!updateAccount) {
        res.status(400);
        throw new Error("could not update bank account");
      }
    } else {
      res.status(400);
      throw new Error("account not found");
    }

    responseHandle.successResponse(
      res,
      "200",
      "bank account deleted successfully",
      check.bank_account
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AccountInfo.DeletePaypalAccount = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Account info']

  const check = await UserModel.findById(req.params.userId);

  try {
    if (!check) {
      res.status(400);
      throw new Error("Id not found");
    }

    if (
      check.paypal_account.filter(
        (account) => account.paypal_id === req.params.id
      ).length > 0
    ) {
      // Find the index of the item with the requested account_id
      const indexToRemove = check.paypal_account.findIndex(
        (account) => account.paypal_id === req.params.id
      );
      check.paypal_account.splice(indexToRemove, 1);

      const updateAccount = await check.save();
      if (!updateAccount) {
        res.status(400);
        throw new Error("could not update bank account");
      }
    } else {
      res.status(400);
      throw new Error("account not found");
    }

    responseHandle.successResponse(
      res,
      "200",
      "paypal account deleted successfully",
      check.paypal_account
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AccountInfo.DeletePayoneer = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Account info']

  const check = await UserModel.findById(req.params.userId);

  try {
    if (!check) {
      res.status(400);
      throw new Error("Id not found");
    }

    if (
      check.payoneer_account.filter(
        (account) => account.payoneer_id === req.params.id
      ).length > 0
    ) {
      // Find the index of the item with the requested account_id
      const indexToRemove = check.payoneer_account.findIndex(
        (account) => account.payoneer_id === req.params.id
      );
      check.payoneer_account.splice(indexToRemove, 1);

      const updateAccount = await check.save();
      if (!updateAccount) {
        res.status(400);
        throw new Error("could not update bank account");
      }
    } else {
      res.status(400);
      throw new Error("account not found");
    }

    responseHandle.successResponse(
      res,
      "200",
      "bank account deleted successfully",
      check.payoneer_account
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default AccountInfo;
