/* eslint-disable no-undef */
import axios from "axios";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { v4 as uuidv4 } from "uuid";
import OrderPaymentModel from "../../models/productOrderPayment.model.js";
import responseHandle from "../../utils/handleResponse.js";
import { sendOrdersMadeEmail } from "../../services/orders.services.js";
dotenv.config();

const config = load(readFileSync("config.yaml", "utf8"));

const OrderPayments = {};

OrderPayments.Pay = asyncHandler(async (req, res) => {
  // #swagger.tags = ['User Payments']

  const { buyer, amount, currency, redirect_url } = req.body;
  try {
    // Generate a 8-digit order
    const tx_ref = "sondya-" + uuidv4();

    const PaymentData = {
      tx_ref: tx_ref,
      customer: {
        email: buyer?.email ?? "",
      },
      amount: amount,
      currency: currency,
      redirect_url: redirect_url,
    };

    const PaymentResponse = await axios.post(
      config.flutterwave.pay,
      PaymentData,
      {
        headers: {
          Authorization: "Bearer " + process.env.FLUTTERWAVE_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    PaymentResponse.data.tx_ref = tx_ref;
    responseHandle.successResponse(
      res,
      201,
      "payments made successfully.",
      PaymentResponse.data
    );
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

OrderPayments.Verify = asyncHandler(async (req, res) => {
  // #swagger.tags = ['User Payments']

  const tx_ref = req.params.tx_ref;

  try {
    const PaymentResponse = await axios.get(
      config.flutterwave.verify + tx_ref,
      {
        headers: {
          Authorization: "Bearer " + process.env.FLUTTERWAVE_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // PaymentResponse.data.tx_ref = tx_ref;

    responseHandle.successResponse(
      res,
      201,
      "payments made successfully.",
      PaymentResponse.data
    );
  } catch (error) {
    // console.log(error);
    res.status(500);
    throw new Error(error);
  }
});

OrderPayments.notifyUser = asyncHandler(async (req, res) => {
  // #swagger.tags = ['User Payments']

  const {
    email,
    username,
    order_id,
    order_status,
    product,
    service,
    total_cost,
    date_ordered,
  } = req.body;

  try {
    const exists = await UserModel.findOne({
      email: email.trim(),
    });

    if (!exists) {
      res.status(400);
      throw new Error("You are not a registered user");
    }
    const sendMailOptions = {
      username,
      order_id,
      order_status,
      product,
      service,
      total_cost,
      date_ordered,
    };
    const message = sendOrdersMadeEmail(email, sendMailOptions);

    responseHandle.successResponse(
      res,
      201,
      "Order Notification sent! Please check spam if you didn't recieve the message.",
      { message }
    );
  } catch (error) {
    // console.log(error);
    res.status(500);
    throw new Error(error);
  }
});

OrderPayments.getProductsPaymentsOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['User Payments']

  const getProductsPaymentsOrder = await OrderPaymentModel.find({
    "buyer.id": req.params.userId,
  });

  try {
    if (!getProductsPaymentsOrder) {
      res.status(404);
      throw new Error("error getting order");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Products payments order found successfully.",
        getProductsPaymentsOrder
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

OrderPayments.getProductPaymentsOrderById = asyncHandler(async (req, res) => {
  // #swagger.tags = ['User Payments']

  const id = req.params.id;
  const getProductPaymentsOrder = await OrderPaymentModel.findById(id);
  try {
    if (!getProductPaymentsOrder) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Products payments order found successfully.",
        getProductPaymentsOrder
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default OrderPayments;
