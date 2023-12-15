import asyncHandler from "express-async-handler";

import randomstring from "randomstring";
import ProductOrderModel from "../../models/productOrder.model.js";
import OrderPaymentModel from "../../models/productOrderPayment.model.js";
import responseHandle from "../../utils/handleResponse.js";

const Order = {};

Order.createProductOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Order']

  const {
    buyer,
    checkout_items,
    payment_method,
    payment_status,
    currency,
    callback_url,
    total_amount,
    shipping_destination,
    order_status,
    total_tax,
    total_shipping_fee,
    total_discount,
  } = req.body;

  // Generate a 8-digit order
  const order_id = randomstring.generate({
    length: 8,
    charset: "numeric",
  });

  const batch_id = randomstring.generate({
    length: 8,
    charset: "numeric",
  });

  const payment_id = randomstring.generate({
    length: 8,
    charset: "numeric",
  });

  try {
    const newProductsOrderPayment = await OrderPaymentModel.create({
      buyer: buyer,
      checkout_items: checkout_items,
      payment_method: payment_method,
      payment_status: payment_status,
      payment_id: payment_id,
      currency: currency,
      callback_url: callback_url,
      total_tax: total_tax,
      total_shipping_fee: total_shipping_fee,
      total_discount: total_discount,
      total_amount: total_amount,
      order_id: order_id,
      batch_id: batch_id,
    });

    checkout_items.forEach(async (checkout_item) => {
      const newProductsOrder = await ProductOrderModel.create({
        buyer: buyer,
        checkout_items: checkout_item,
        order_status: order_status,
        payment_id: payment_id,
        payment_status: payment_status,
        order_id: order_id,
        batch_id: batch_id,
        shipping_destination: shipping_destination,
      });

      if (!newProductsOrder) {
        res.status(500);
        throw new Error("could not create new product order");
      }
    });

    if (!newProductsOrderPayment) {
      res.status(500);
      throw new Error("could not create new product order");
    }
    responseHandle.successResponse(
      res,
      201,
      "Products order created successfully.",
      newProductsOrderPayment
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

Order.getProductsOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Order']

  const getProductsOrder = await ProductOrderModel.find({
    "buyer.id": req.params.userId,
  });

  try {
    if (!getProductsOrder) {
      res.status(404);
      throw new Error("error getting order");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Products order found successfully.",
        getProductsOrder
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

Order.getProductOrderById = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Order']

  const id = req.params.id;

  const getProductOrder = await ProductOrderModel.findById(id);
  try {
    if (!getProductOrder) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Products order found successfully.",
        getProductOrder
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default Order;
