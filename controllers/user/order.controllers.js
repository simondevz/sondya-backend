import asyncHandler from "express-async-handler";

import ProductOrderModel from "../../models/productOrder.model.js";
import responseHandle from "../../utils/handleResponse.js";

const Order = {};

Order.createProductOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Order']

  const {
    checkoutItems,
    subTotal,
    shippingFee,
    tax,
    discount,
    totalAmount,
    currency,
    buyer,
    ShippingDestination,
    paymentMethod,
    paymentStatus,
    Category,
    orderStatus,
    callback_url,
  } = req.body;

  try {
    const newProductsOrder = await ProductOrderModel.create({
      checkoutItems: checkoutItems,
      subTotal: subTotal,
      shippingFee: shippingFee,
      tax: tax,
      discount: discount,
      totalAmount: totalAmount,
      currency: currency,
      buyer: buyer,
      ShippingDestination: ShippingDestination,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      Category: Category,
      orderStatus: orderStatus,
      callback_url: callback_url,
    });

    if (!newProductsOrder) {
      res.status(500);
      throw new Error("could not create new product order");
    }
    responseHandle.successResponse(
      res,
      201,
      "Products order created successfully.",
      newProductsOrder
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

Order.getProductsOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Order']

  const getProductsOrder = await ProductOrderModel.find();

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
