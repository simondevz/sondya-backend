import asyncHandler from "express-async-handler";
import ProductModel from "../models/products.model.js";
import ServiceModel from "../models/services.model.js";
import responseHandle from "../utils/handleResponse.js";

const homeList = {};

homeList.getAllProducts = asyncHandler(async (req, res) => {
  // #swagger.tags = ['home']

  //  for a regex search pattern
  const searchRegex = new RegExp(req.query.search, "i");

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // this line of code helps to get all the products randomly without any filtering
  const getall = await ProductModel.aggregate([
    {
      $match: {
        sub_category: { $regex: searchRegex },
        product_status: { $nin: ["sold", "draft"] },
        total_stock: { $gt: 0 },
      },
    },
    { $skip: (page - 1) * limit },
    { $sample: { size: limit } },
  ]);

  const total = await ProductModel.countDocuments({
    sub_category: { $regex: searchRegex },
    product_status: { $nin: ["sold", "draft"] },
    total_stock: { $gt: 0 },
  });

  try {
    if (!getall) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(res, 200, "services found successfully.", {
        data: getall,
        count: total,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

homeList.getAllServices = asyncHandler(async (req, res) => {
  // #swagger.tags = ['home']

  //  for a regex search pattern
  const searchRegex = new RegExp(req.query.search, "i");

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // this line of code helps to get all the services randomly without any filtering
  const getall = await ServiceModel.aggregate([
    {
      $match: {
        sub_category: { $regex: searchRegex },
        service_status: { $nin: ["draft", "suspended", "closed"] },
      },
    },
    { $skip: (page - 1) * limit },
    { $sample: { size: limit } },
  ]);

  const total = await ServiceModel.countDocuments({
    sub_category: { $regex: searchRegex },
    service_status: { $nin: ["draft", "suspended", "closed"] },
  });

  try {
    if (!getall) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(res, 200, "products found successfully.", {
        data: getall,
        count: total,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

homeList.getProductById = asyncHandler(async (req, res) => {
  // #swagger.tags = ['home']

  // the slug name causes a bug
  // const OriginalString = req.params.name.replace(//g, " ");

  //  for a regex search pattern
  const productDetails = await ProductModel.findOne({
    _id: req.params.id,
    // name: new RegExp(OriginalString, "i"),
  });

  try {
    if (!productDetails) {
      res.status(404);
      throw new Error("product not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "products found successfully.",
        productDetails
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

homeList.getServiceById = asyncHandler(async (req, res) => {
  // #swagger.tags = ['home']
  // the slug name causes a bug
  // const OriginalString = req.params.name.replace(/-/g, " ");

  //  for a regex search pattern
  const serviceDetails = await ServiceModel.findOne({
    _id: req.params.id,
    // name: new RegExp(OriginalString, "i"),
  });

  try {
    if (!serviceDetails) {
      res.status(404);
      throw new Error("services not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "services found successfully.",
        serviceDetails
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default homeList;
