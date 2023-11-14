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
  } = req.body;

  try {
    const productTaken = await ProductModel.findOne({ name: name.trim() });
    if (productTaken) {
      res.status(400);
      throw new Error("product name is taken");
    }

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
      owner: owner,
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
      image: imageUrl,
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
  } = req.body;

  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

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

      // delete previously uploaded images from cloudinary
      const initialImageArray = [];
      check.image.forEach((image) => {
        initialImageArray.push(image.public_id);
      });
      deleteUploads(initialImageArray);

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

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        owner: owner,
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
        image: imageUrl,
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
  const getall = await ProductModel.find({ owner: { id: req.params.userId } });
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

export default SellerProducts;
