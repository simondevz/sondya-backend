import asyncHandler from "express-async-handler";
import CategoryModel from "../../models/categories.model.js";
import { deleteUploads } from "../../utils/deleteupload.js";
import responseHandle from "../../utils/handleResponse.js";
import handleUpload from "../../utils/upload.js";

const adminCategories = {};

adminCategories.create = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  try {
    const categoryTaken = await CategoryModel.findOne({ name: name.trim() });
    if (categoryTaken) {
      res.status(400);
      throw new Error("Category name is taken");
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

    const newCategories = await CategoryModel.create({
      name: name.trim(),
      description: description.trim(),
      image: imageUrl,
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

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        description: description,
        image: imageUrl,
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
