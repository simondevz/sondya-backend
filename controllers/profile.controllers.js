import asyncHandler from "express-async-handler";
import UserModel from "../models/users.model.js";
import { deleteUploads } from "../utils/deleteupload.js";
import responseHandle from "../utils/handleResponse.js";
import handleUpload from "../utils/upload.js";

import ProductOrderModel from "../models/productOrder.model.js";
import ServiceOrderModel from "../models/serviceOrder.model.js";

const profile = {};

profile.update = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Users']
  const check = await UserModel.findById(req.params.id);
  const {
    first_name,
    last_name,
    username,
    email,
    phone_number,
    state,
    city,
    address,
    currency,
    language,
    country,
    zip_code,
    website_url,
  } = req.body;
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    // start of upload images
    let imageUrl;

    if (req.files.length) {
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
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        phone_number: phone_number,
        state: state,
        city: city,
        address: address,
        currency: currency,
        language: language,
        country: country,
        zip_code: zip_code,
        website_url: website_url,
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

profile.updateSocialMedia = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Users']
  const check = await UserModel.findById(req.params.id);
  const {
    facebook_url,
    linkedin_url,
    youtube_url,
    instagram_url,
    twitter_url,
    tiktok_url,
  } = req.body;
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        facebook_url: facebook_url,
        linkedin_url: linkedin_url,
        youtube_url: youtube_url,
        instagram_url: instagram_url,
        twitter_url: twitter_url,
        tiktok_url: tiktok_url,
      },
      {
        new: true,
      }
    );
    if (updatedUser) {
      responseHandle.successResponse(
        res,
        201,
        "profile Social handles updated successfully.",
        updatedUser
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

profile.updateCompanyDetails = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Users']
  const check = await UserModel.findById(req.params.id);
  const { company_details } = req.body;
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    // console.log(JSON.parse(JSON.stringify(company_details)));
    // const company_detail2 = JSON.stringify(company_details);

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        company_details:
          company_details !== undefined && JSON.parse(company_details),
      },
      {
        new: true,
      }
    );
    if (updatedUser) {
      responseHandle.successResponse(
        res,
        201,
        "company details handles updated successfully.",
        updatedUser
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

profile.changePassword = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Users']
  const check = await UserModel.findById(req.params.id);
  const { current_password, new_password, confirm_password } = req.body;
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    if ((await check.matchPassword(current_password)) === false) {
      res.status(400);
      throw new Error("Current password is not correct");
    }

    if (new_password !== confirm_password) {
      res.status(400);
      throw new Error("New Passwords doesn't match");
    }

    check.password = new_password;
    const changePassword = await check.save();

    if (!changePassword) {
      res.status(400);
      throw new Error("The password was not updated. Please try again");
    }

    responseHandle.successResponse(
      res,
      "200",
      "password updated successfully",
      {
        email: check.email,
      }
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

profile.getbyid = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Users']
  const check = await UserModel.findById(req.params.id);

  const OrderProductTotal = await ProductOrderModel.countDocuments({
    "buyer.id": req.params.id,
  });
  const OrderServiceTotal = await ServiceOrderModel.countDocuments({
    "buyer.id": req.params.id,
  });

  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }
    if (check) {
      check.order_total = OrderProductTotal + OrderServiceTotal;

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

profile.getUsers = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const searchRegex = new RegExp(req.query.search, "i");
    const limit = parseInt(req.query.limit) || 20;

    const users = await UserModel.find({
      $or: [
        { first_name: { $regex: searchRegex } },
        { last_name: { $regex: searchRegex } },
        { username: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { website_url: { $regex: searchRegex } },
      ],
    }).limit(limit);

    responseHandle.successResponse(
      res,
      200,
      "found users successfully.",
      users
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default profile;
