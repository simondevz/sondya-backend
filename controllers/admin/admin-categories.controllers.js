import asyncHandler from "express-async-handler";
import CategoryModel from "../../models/categories.model.js";
import responseHandle from "../../utils/handleResponse.js";

const adminCategories = {};

adminCategories.create = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  try {
    const categoryTaken = await CategoryModel.findOne({ name: name.trim() });
    if (categoryTaken) {
      res.status(400);
      throw new Error("Category name is taken");
    }

    const newCategories = await CategoryModel.create({
      name: name.trim(),
      description: description.trim(),
    });

    if (!newCategories) {
      res.status(500);
      throw new Error("could not create new category");
    }
    responseHandle.successResponse(
      res,
      201,
      "Category created successfully.",
      newCategories
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminCategories.update = asyncHandler(async (req, res) => {
  const check = await CategoryModel.findById(req.params.id);

  const { name, description } = req.body;
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        description: description.trim(),
      },
      {
        new: true,
      }
    );

    if (!updatedCategory) {
      res.status(500);
      throw new Error("could not update category");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Category updated successfully.",
        updatedCategory
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminCategories.delete = asyncHandler(async (req, res) => {
  const check = await CategoryModel.findById(req.params.id);
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }
    const deleteCategory = await CategoryModel.findByIdAndDelete(req.params.id);

    if (!deleteCategory) {
      res.status(500);
      throw new Error("could not delete category");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "category deleted successfully.",
        "category deleted"
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminCategories.getById = asyncHandler(async (req, res) => {
  const categoryDetail = await CategoryModel.findById(req.params.id);

  try {
    if (!categoryDetail) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "category found successfully.",
        categoryDetail
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminCategories.getAll = asyncHandler(async (req, res) => {
  const getall = await CategoryModel.find();
  try {
    if (!getall) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "category found successfully.",
        getall
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default adminCategories;
