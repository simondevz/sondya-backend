import asyncHandler from "express-async-handler";
import ProductModel from "../../models/products.model.js";
import responseHandle from "../../utils/handleResponse.js";

const adminProducts = {};

adminProducts.create = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description,
    total_stock,
    tag,
    brand,
    model,
    current_price,
    product_status,

    old_price,
    discount_percentage,
    vat_percentage,
    total_variants,
  } = req.body;

  try {
    const productTaken = await ProductModel.findOne({ name: name.trim() });
    if (productTaken) {
      res.status(400);
      throw new Error("product name is taken");
    }
    const newProducts = await ProductModel.create({
      name: name,
      category: category,
      description: description,
      total_stock: total_stock,
      tag: tag,
      brand: brand,
      model: model,
      current_price: current_price,
      product_status: product_status,

      old_price: old_price,
      discount_percentage: discount_percentage,
      vat_percentage: vat_percentage,
      total_variants: total_variants,
    });

    if (!newProducts) {
      res.status(500);
      throw new Error("could not create new products");
    }
    responseHandle.successResponse(
      res,
      201,
      "Products created successfully.",
      newProducts
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminProducts.update = asyncHandler(async (req, res) => {
  const check = await ProductModel.findById(req.params.id);
  const {
    name,
    category,
    description,
    total_stock,
    tag,
    brand,
    model,
    current_price,
    product_status,

    old_price,
    discount_percentage,
    vat_percentage,
    total_variants,
  } = req.body;

  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        category: category,
        description: description,
        total_stock: total_stock,
        tag: tag,
        brand: brand,
        model: model,
        current_price: current_price,
        product_status: product_status,

        old_price: old_price,
        discount_percentage: discount_percentage,
        vat_percentage: vat_percentage,
        total_variants: total_variants,
      },
      {
        new: true,
      }
    );

    if (!updatedProduct) {
      res.status(500);
      throw new Error("could not update products");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Products updated successfully.",
        updatedProduct
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminProducts.delete = asyncHandler(async (req, res) => {
  const check = await ProductModel.findById(req.params.id);

  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    const deleteProducts = await ProductModel.findByIdAndDelete(req.params.id);

    if (!deleteProducts) {
      res.status(500);
      throw new Error("could not delete product");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "product deleted successfully.",
        "product deleted"
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminProducts.getById = asyncHandler(async (req, res) => {
  const productDetails = await ProductModel.findById(req.params.id);

  try {
    if (!productDetails) {
      res.status(404);
      throw new Error("Id not found");
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

adminProducts.getAll = asyncHandler(async (req, res) => {
  const getall = await ProductModel.find();
  try {
    if (!getall) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "products found successfully.",
        getall
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default adminProducts;
