import asyncHandler from "express-async-handler";
import responseHandle from "../../utils/handleResponse.js";
import ServicesModel from "../../models/services.model.js";
import CategoryModel from "../../models/categories.model.js";

const userServices = {};

userServices.getServices = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Services']
  try {
    //  for a regex search pattern
    const searchRegex = new RegExp(req.query.search, "i");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const subcategory = req.query.subcategory || null;
    const popularBrands = req.query.popularBrands || null;
    const priceRange = req.query.priceRange || null;
    const [minPrice, maxPrice] = priceRange
      ? priceRange.split("_")
      : ["0", "0"];

    const services = await ServicesModel.find({
      [subcategory ? "sub_category" : null]: subcategory,
      [priceRange ? "current_price" : null]: priceRange
        ? {
            $gte: minPrice === "0" ? 0 : Number(minPrice),
            $lte: maxPrice === "0" ? Infinity : Number(maxPrice),
          }
        : null,
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { sub_category: { $regex: searchRegex } },
        { tag: { $regex: searchRegex } },
        { brand: { $regex: searchRegex } },
        { model: { $regex: searchRegex } },
      ],
      [popularBrands?.length ? "$or" : null]: popularBrands?.length
        ? popularBrands?.split(",").map((brand) => {
            return { brand };
          })
        : null,
    })
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await ServicesModel.countDocuments({
      [subcategory ? "sub_category" : null]: subcategory,
      [priceRange ? "current_price" : null]: priceRange
        ? {
            $gte: minPrice === "0" ? 0 : Number(minPrice),
            $lte: maxPrice === "0" ? Infinity : Number(maxPrice),
          }
        : null,
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { sub_category: { $regex: searchRegex } },
        { tag: { $regex: searchRegex } },
        { brand: { $regex: searchRegex } },
        { model: { $regex: searchRegex } },
      ],
      [popularBrands?.length ? "$or" : null]: popularBrands?.length
        ? popularBrands?.split(",").map((brand) => {
            return { brand };
          })
        : null,
    });

    if (!services) {
      res.status(500);
      throw new Error("Could not get Group Chats");
    } else {
      responseHandle.successResponse(
        res,
        201,
        "services gotten successfully.",
        { services, count }
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

userServices.getCategories = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Services']
  const getCategories = await CategoryModel.find({ category: "Service" }).sort({
    name: 1,
  });
  try {
    if (!getCategories) {
      res.status(404);
      throw new Error("subcategories not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "subcategorys found successfully.",
        getCategories
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default userServices;
