import asyncHandler from "express-async-handler";

import ProductOrderModel from "../../models/productOrder.model.js";
import ServiceOrderModel from "../../models/serviceOrder.model.js";
import responseHandle from "../../utils/handleResponse.js";

const SellerOrder = {};

SellerOrder.SellerGetProductsOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Order']

  const SellerGetProductsOrder = await ProductOrderModel.find({
    "checkout_items.owner.id": req.params.userId,
  });

  try {
    if (!SellerGetProductsOrder) {
      res.status(404);
      throw new Error("error getting order");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Products order found successfully.",
        SellerGetProductsOrder
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

SellerOrder.SellerUpdateProductsOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Order']

  const productOrder = req.body;
  // console.log("productOrder ==>>", productOrder);
  const updatedProductsOrder = await ProductOrderModel.findByIdAndUpdate(
    productOrder?._id,
    {
      ...productOrder,
    },
    { new: true }
  );
  // console.log("updatedProductsOrder ==>> ", updatedProductsOrder);

  try {
    if (!updatedProductsOrder) {
      res.status(404);
      throw new Error("error getting order");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Products order updated successfully.",
        updatedProductsOrder
      );
    }
  } catch (error) {
    res.status(500);
    // console.log(error);
    throw new Error(error);
  }
});

SellerOrder.SellerGetProductOrderById = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Order']

  const id = req.params.id;
  const SellerGetProductOrder = await ProductOrderModel.findById(id);
  try {
    if (!SellerGetProductOrder) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Product order found successfully.",
        SellerGetProductOrder
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

SellerOrder.SellerdeleteProductOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Order']

  const check = await ProductOrderModel.findById(req.params.id);
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }
    const deleteProductOrder = await ProductOrderModel.findByIdAndDelete(
      req.params.id
    );

    if (!deleteProductOrder) {
      res.status(500);
      throw new Error("could not delete product order");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "product order deleted successfully.",
        "product order deleted"
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

SellerOrder.getServiceOrdersSeller = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Order']
  const seller_id = req.params.seller_id;

  try {
    const serviceOrders = await ServiceOrderModel.find({
      "seller.id": seller_id,
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

SellerOrder.updateServiceOrderTerms = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Order']

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

SellerOrder.updateServiceOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Order']

  const serviceOrder = req.body;
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

SellerOrder.getServiceOrderById = asyncHandler(async (req, res) => {
  try {
    const order_id = req.params.order_id;

    const serviceOrder = await ServiceOrderModel.findOne({ order_id });

    if (!serviceOrder) {
      res.status(500);
      throw new Error("could not get service order1");
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

export default SellerOrder;
