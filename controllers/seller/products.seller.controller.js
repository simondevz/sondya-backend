import asyncHandler from "express-async-handler";
import ProductModel from "../../models/products.model.js";
import { deleteUploads } from "../../utils/deleteupload.js";
import responseHandle from "../../utils/handleResponse.js";
import handleUpload from "../../utils/upload.js";

const SellerProducts = {};

SellerProducts.create = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Products']
  const {
    name,
    owner,
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

    country,
    state,
    city,
    zip_code,
    address,
  } = req.body;

  try {
    // start of upload images
    let imageUrl;

    if (req.files) {
      // upload images to cloudinary
      let files = req?.files;
      let multiplePicturePromise = files.map(async (picture, index) => {
        // eslint-disable-next-line no-undef
        const b64 = Buffer.from(picture.buffer).toString("base64");
        let dataURI = "data:" + picture.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI, index);
        return cldRes;
      });

      // get url of uploaded images
      const imageResponse = await Promise.all(multiplePicturePromise);

      imageUrl = imageResponse.map((image) => {
        const url = image.secure_url;
        const public_id = image.public_id;
        const folder = image.folder;
        return { url, public_id, folder };
      });
    }
    // end of uploaded images

    const newProducts = await ProductModel.create({
      name: name,
      owner: owner !== undefined && JSON.parse(owner),
      category: "product",
      sub_category: category,
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
      image: imageUrl,

      country: country,
      state: state,
      city: city,
      zip_code: zip_code,
      address: address,
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

SellerProducts.update = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Products']
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
    variants,
    deleteImageId,

    country,
    state,
    city,
    zip_code,
    address,
  } = req.body;

  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    // start of upload images
    let imageUrl = [];

    if (req.files) {
      // upload images to cloudinary
      let files = req?.files;
      let multiplePicturePromise = files.map(async (picture, index) => {
        // eslint-disable-next-line no-undef
        const b64 = Buffer.from(picture.buffer).toString("base64");
        let dataURI = "data:" + picture.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI, index);
        return cldRes;
      });

      // get url of uploaded images
      const imageResponse = await Promise.all(multiplePicturePromise);

      imageUrl = imageResponse.map((image) => {
        const url = image.secure_url;
        const public_id = image.public_id;
        const folder = image.folder;
        return { url, public_id, folder };
      });
    }
    // end of uploaded images

    //delete initialy uploaded images
    let deleteImageId1 = JSON.parse(deleteImageId);
    if (deleteImageId1 !== undefined && deleteImageId1.length > 0) {
      deleteUploads(deleteImageId1);
      deleteImageId1.forEach((id) => check.image.splice(id, 1));
    }

    imageUrl = [...imageUrl, ...check.image];
    //delete initialy uploaded images ends

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
        variants: JSON.parse(variants),
        image: imageUrl.length > 0 ? imageUrl : [],

        country: country,
        state: state,
        city: city,
        zip_code: zip_code,
        address: address,
      },
      {
        new: true,
      }
    );
    console.log(" variants ===> ", variants);
    console.log("updated product ====> ", updatedProduct);

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

SellerProducts.delete = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Products']
  const check = await ProductModel.findById(req.params.id);

  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    const deleteProducts = await ProductModel.findByIdAndDelete(req.params.id);

    // delete previously uploaded images from cloudinary
    const initialImageArray = [];
    check.image.forEach((image) => {
      initialImageArray.push(image.public_id);
    });
    deleteUploads(initialImageArray);

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

SellerProducts.getById = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Products']
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

SellerProducts.getAll = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Products']
  const searchRegex = new RegExp(req.query.search, "i");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const getall = await ProductModel.find({
    "owner.id": req.params.userId,
    $or: [
      { name: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      { sub_category: { $regex: searchRegex } },
      { tag: { $regex: searchRegex } },
      { brand: { $regex: searchRegex } },
      { model: { $regex: searchRegex } },
    ],
  })
    .skip((page - 1) * limit)
    .limit(limit);

  const count = await ProductModel.countDocuments({
    "owner.id": req.params.userId,
    $or: [
      { name: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      { sub_category: { $regex: searchRegex } },
      { tag: { $regex: searchRegex } },
      { brand: { $regex: searchRegex } },
      { model: { $regex: searchRegex } },
    ],
  });
  try {
    if (!getall) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(res, 200, "products found successfully.", {
        products: getall,
        count,
      });
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

export default SellerProducts;
