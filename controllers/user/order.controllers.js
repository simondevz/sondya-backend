import asyncHandler from "express-async-handler";

import randomstring from "randomstring";
import ProductOrderModel from "../../models/productOrder.model.js";
import OrderPaymentModel from "../../models/productOrderPayment.model.js";
import ServiceOrderModel from "../../models/serviceOrder.model.js";
import ServiceModel from "../../models/services.model.js";
import UserModel from "../../models/users.model.js";
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
    redirect_url,
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
      redirect_url: redirect_url,
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

Order.createServiceOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Order']

  const { serviceOrder } = req.body;
  const service_id = req.params.service_id;

  // Generate a 8-digit order
  serviceOrder.order_id = randomstring.generate({
    length: 8,
    charset: "numeric",
  });

  serviceOrder.payment_id = randomstring.generate({
    length: 8,
    charset: "numeric",
  });

  try {
    const check = await ServiceModel.exists({ _id: service_id });
    if (!check) {
      res.status(404);
      throw new Error("Path not found");
    }

    const checkBuyer = await UserModel.exists({ _id: serviceOrder?.buyer.id });
    if (!checkBuyer) {
      res.status(400);
      throw new Error("Can't find buyer");
    }

    const checkSeller = await UserModel.exists({
      _id: serviceOrder?.seller.id,
    });
    if (!checkSeller) {
      res.status(400);
      throw new Error("Can't find seller");
    }

    const newServiceOrder = await ServiceOrderModel.create({ ...serviceOrder });
    if (!newServiceOrder) {
      res.status(500);
      throw new Error("could not create new service order");
    }

    responseHandle.successResponse(
      res,
      201,
      "Service order created successfully.",
      newServiceOrder
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

Order.updateServiceOrderTerms = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Order']

  const {
    amount,
    duration,
    durationUnit,
    acceptedByBuyer,
    acceptedBySeller,
    rejectedByBuyer,
    rejectedBySeller,
  } = req.body;
  const order_id = req.params.order_id;
  const terms = {
    amount,
    duration,
    durationUnit,
    acceptedByBuyer,
    acceptedBySeller,
    rejectedByBuyer,
    rejectedBySeller,
  };

  try {
    const updatedServiceOrder = await ServiceOrderModel.findOneAndUpdate(
      { order_id },
      {
        "checkout_items.terms": terms,
      },
      { new: true }
    );

    if (!updatedServiceOrder) {
      res.status(500);
      throw new Error("could not update service order");
    }

    responseHandle.successResponse(
      res,
      200,
      "Service order updated successfully.",
      updatedServiceOrder.checkout_items.terms
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

Order.updateServiceOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Order']

  const serviceOrder = req.body.serviceOrder;
  const order_id = req.params.order_id;

  try {
    const updatedServiceOrder = await ServiceOrderModel.findOneAndUpdate(
      { order_id },
      serviceOrder,
      { new: true }
    );

    if (!updatedServiceOrder) {
      res.status(500);
      throw new Error("could not update service order");
    }

    responseHandle.successResponse(
      res,
      200,
      "Service order updated successfully.",
      updatedServiceOrder
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

Order.getServiceOrderById = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Order']
  const order_id = req.params.order_id;

  try {
    const serviceOrder = await ServiceOrderModel.findOne({ order_id });

    if (!serviceOrder) {
      res.status(500);
      throw new Error("could not get service order");
    }

    responseHandle.successResponse(
      res,
      200,
      "Service order gotten successfully.",
      serviceOrder
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

Order.getServiceOrdersBuyer = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Order']
  const buyer_id = req.params.buyer_id;

  try {
    const serviceOrders = await ServiceOrderModel.find({
      "buyer.id": buyer_id,
    });

    if (!serviceOrders) {
      res.status(500);
      throw new Error("could not get service orders");
    }

    responseHandle.successResponse(
      res,
      200,
      "Service orders gotten successfully.",
      serviceOrders
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default Order;
