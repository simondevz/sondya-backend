import asyncHandler from "express-async-handler";

import ProductOrderModel from "../../models/productOrder.model.js";
import responseHandle from "../../utils/handleResponse.js";

const AdminOrder = {};

AdminOrder.AdminGetProductsOrder = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Order']

  const AdminGetProductsOrder = await ProductOrderModel.find();

  try {
    if (!AdminGetProductsOrder) {
      res.status(404);
      throw new Error("error getting order");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Products order found successfully.",
        AdminGetProductsOrder
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

export default AdminOrder;
