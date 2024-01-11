import asyncHandler from "express-async-handler";
import CategoryModel from "../../models/categories.model.js";
import ServicesModel from "../../models/services.model.js";
import responseHandle from "../../utils/handleResponse.js";

const userServices = {};

userServices.getServiceById = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Services']
  try {
    const id = req.params.id;
    const service = await ServicesModel.findById(id);

    if (!service) {
      res.status(500);
      throw new Error("Could not get service");
    } else {
      responseHandle.successResponse(
        res,
        201,
        "services gotten successfully.",
        service
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

userServices.getServices = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Services']
  try {
    //  for a regex search pattern
    const searchRegex = new RegExp(req.query.search, "i");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortBy = req.query.sortBy || "latest";
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
      service_status: { $nin: ["draft", "suspended", "closed"] },
    })
      .collation({ locale: "en", strength: 2 })
      .sort({
        [sortBy === "a-z" || sortBy === "z-a"
          ? "name"
          : sortBy === "latest" || sortBy === "oldest"
          ? "createdAt"
          : sortBy === "mostRated" || sortBy === "leastRated"
          ? "rating"
          : null]:
          sortBy === "a-z"
            ? 1
            : sortBy === "z-a"
            ? -1
            : sortBy === "latest"
            ? -1
            : sortBy === "oldest"
            ? 1
            : sortBy === "mostRated"
            ? -1
            : sortBy === "leastRated"
            ? 1
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
      service_status: { $nin: ["draft", "suspended", "closed"] },
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
