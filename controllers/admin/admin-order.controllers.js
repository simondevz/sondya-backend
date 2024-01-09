import asyncHandler from "express-async-handler";

import ProductOrderModel from "../../models/productOrder.model.js";
import ServiceOrderModel from "../../models/serviceOrder.model.js";
import responseHandle from "../../utils/handleResponse.js";

const AdminOrder = {};

AdminOrder.AdminGetProductsOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Order']

  try {
    const searchRegex = new RegExp(req.query.search, "i");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const statusRegex = new RegExp(req.query.status, "i");
    const date = new Date(req.query.date);

    const AdminGetProductsOrder = await ProductOrderModel.find({
      order_status: { $regex: statusRegex },
      [req.body.date ? "createdAt" : null]: req.body.date
        ? {
            $gte: date,
            $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
          }
        : null,
      $or: [
        { batch_id: { $regex: searchRegex } },
        { order_id: { $regex: searchRegex } },
        { "checkout_items.name": { $regex: searchRegex } },
        { "checkout_items.category": { $regex: searchRegex } },
        { "checkout_items.sub_category": { $regex: searchRegex } },
        { "checkout_items.tag": { $regex: searchRegex } },
        { "checkout_items.brand": { $regex: searchRegex } },
        { "checkout_items.model": { $regex: searchRegex } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await ProductOrderModel.countDocuments({
      order_status: { $regex: statusRegex },
      [req.body.date ? "createdAt" : null]: req.body.date
        ? {
            $gte: date,
            $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
          }
        : null,
      $or: [
        { batch_id: { $regex: searchRegex } },
        { order_id: { $regex: searchRegex } },
        { "checkout_items.name": { $regex: searchRegex } },
        { "checkout_items.category": { $regex: searchRegex } },
        { "checkout_items.sub_category": { $regex: searchRegex } },
        { "checkout_items.tag": { $regex: searchRegex } },
        { "checkout_items.brand": { $regex: searchRegex } },
        { "checkout_items.model": { $regex: searchRegex } },
      ],
    });

    if (!AdminGetProductsOrder) {
      res.status(404);
      throw new Error("error getting order");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Products order found successfully.",
        { orders: AdminGetProductsOrder, count }
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AdminOrder.AdminGetProductOrderById = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Order']

  const id = req.params.id;
  const AdminGetProductOrder = await ProductOrderModel.findById(id);
  try {
    if (!AdminGetProductOrder) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Product order found successfully.",
        AdminGetProductOrder
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AdminOrder.AdmindeleteProductOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Order']

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

AdminOrder.AdminGetServiceOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Order']

  try {
    const searchRegex = new RegExp(req.query.search, "i");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const statusRegex = new RegExp(req.query.status, "i");
    const date = new Date(req.query.date);

    const AdminGetServiceOrder = await ServiceOrderModel.find({
      order_status: { $regex: statusRegex },
      [req.body.date ? "createdAt" : null]: req.body.date
        ? {
            $gte: date,
            $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
          }
        : null,
      $or: [
        { order_id: { $regex: searchRegex } },
        { "checkout_items.name": { $regex: searchRegex } },
        { "checkout_items.category": { $regex: searchRegex } },
        { "checkout_items.sub_category": { $regex: searchRegex } },
        { "checkout_items.brief_description": { $regex: searchRegex } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await ServiceOrderModel.countDocuments({
      order_status: { $regex: statusRegex },
      [req.body.date ? "createdAt" : null]: req.body.date
        ? {
            $gte: date,
            $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
          }
        : null,
      $or: [
        { order_id: { $regex: searchRegex } },
        { "checkout_items.name": { $regex: searchRegex } },
        { "checkout_items.category": { $regex: searchRegex } },
        { "checkout_items.sub_category": { $regex: searchRegex } },
        { "checkout_items.brief_description": { $regex: searchRegex } },
      ],
    });

    if (!AdminGetServiceOrder) {
      res.status(404);
      throw new Error("error getting order");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Service orders found successfully.",
        { orders: AdminGetServiceOrder, count }
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AdminOrder.AdminGetServiceOrderById = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Order']

  const id = req.params.id;
  const AdminGetServiceOrder = await ServiceOrderModel.findById(id);
  try {
    if (!AdminGetServiceOrder) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Service order found successfully.",
        AdminGetServiceOrder
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AdminOrder.AdmindeleteServiceOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Order']

  const check = await ServiceOrderModel.findById(req.params.id);
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }
    const deleteServiceOrder = await ServiceOrderModel.findByIdAndDelete(
      req.params.id
    );

    if (!deleteServiceOrder) {
      res.status(500);
      throw new Error("could not delete service order");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "service order deleted successfully.",
        "service order deleted"
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

AdminOrder.AdminGetUserOrders = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Order']

  try {
    const AdminGetProductOrder = await ProductOrderModel.find({
      "buyer.id": req.params.id,
    });
    const AdminGetServiceOrder = await ServiceOrderModel.find({
      "buyer.id": req.params.id,
    });

    if (!AdminGetProductOrder) {
      res.status(404);
      throw new Error("error getting product order");
    }
    if (!AdminGetServiceOrder) {
      res.status(404);
      throw new Error("error getting service order");
    }
    responseHandle.successResponse(res, 200, "orders found successfully.", {
      ProductOrders: AdminGetProductOrder,
      ServiceOrders: AdminGetServiceOrder,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default AdminOrder;
