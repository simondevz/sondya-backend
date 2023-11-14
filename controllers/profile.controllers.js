import asyncHandler from "express-async-handler";
import UserModel from "../models/users.model.js";
import { deleteUploads } from "../utils/deleteupload.js";
import responseHandle from "../utils/handleResponse.js";
import handleUpload from "../utils/upload.js";

const profile = {};

profile.update = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Users']
  const check = await UserModel.findById(req.params.id);
  const { first_name, last_name, username, email, password } = req.body;
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

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        first_name: first_name,
        last_name: last_name,
        username: username,
        email: email,
        password: password,
        image: imageUrl,
      },
      {
        new: true,
      }
    );
    if (updatedUser) {
      responseHandle.successResponse(
        res,
        201,
        "profile updated successfully.",
        updatedUser
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

profile.getbyid = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Users']
  const check = await UserModel.findById(req.params.id);

  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }
    if (check) {
      responseHandle.successResponse(
        res,
        200,
        "profile found successfully.",
        check
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default profile;
