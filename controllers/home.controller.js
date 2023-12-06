import asyncHandler from "express-async-handler";
import CategoryModel from "../models/categories.model.js";
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

  const getall = await ProductModel.find({
    sub_category: { $regex: searchRegex },
  })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await ProductModel.countDocuments({
    sub_category: { $regex: searchRegex },
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

  const getall = await ServiceModel.find({
    sub_category: { $regex: searchRegex },
  })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await ServiceModel.countDocuments({
    sub_category: { $regex: searchRegex },
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

homeList.getAllCategories = asyncHandler(async (req, res) => {
  // #swagger.tags = ['home']

  //  for a regex search pattern
  const searchRegex = new RegExp(req.query.category, "i");

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;

  const getall = await CategoryModel.find({ category: { $regex: searchRegex } })
    .skip((page - 1) * limit)
    .limit(limit);

  try {
    if (!getall) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "categories found successfully.",
        getall
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default homeList;
