import asyncHandler from "express-async-handler";
import UserModel from "../../models/users.model.js";
import { deleteUploads } from "../../utils/deleteupload.js";
import responseHandle from "../../utils/handleResponse.js";

const users = {};

users.create = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Users']
  const { first_name, last_name, username, email, password } = req.body;

  try {
    const emailTaken = await UserModel.findOne({ email: email.trim() });
    if (emailTaken) {
      res.status(400);
      throw new Error("Email is taken");
    }

    const usernameTaken = await UserModel.findOne({
      username: username.trim(),
    });

    if (usernameTaken) {
      res.status(400);
      throw new Error("Username is taken");
    }

    const newUser = await UserModel.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim(),
      username: username.trim(),
      password: password.trim(),
    });

    if (!newUser) {
      res.status(500);
      throw new Error("could not create user");
    }
    responseHandle.successResponse(
      res,
      201,
      "Account created successfully.",
      newUser
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

users.update = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Users']
  const check = await UserModel.findById(req.params.id);
  const {
    first_name,
    last_name,
    status,
    username,
    email,
    type,
    phone_number,
    address,
    state,
    country,
    zip_code,

    //social media
    facebook_url,
    linkedin_url,
    youtube_url,
    instagram_url,
    twitter_url,
    tiktok_url,

    //new
    city,
    currency,
    language,
  } = req.body;

  let password;
  if (req.body?.password) {
    password = req.body.password;
  }

  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        first_name: first_name,
        last_name: last_name,
        username: username,
        email: email,
        status: status,
        password: password,
        type: type,
        phone_number: phone_number,
        address: address,
        state: state,
        country: country,
        zip_code: zip_code,

        //social media
        facebook_url: facebook_url,
        linkedin_url: linkedin_url,
        youtube_url: youtube_url,
        instagram_url: instagram_url,
        twitter_url: twitter_url,
        tiktok_url: tiktok_url,

        //new
        city: city,
        currency: currency,
        language: language,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      res.status(500);
      throw new Error("could not update user");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "User updated successfully.",
        updatedUser
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

users.delete = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Users']
  const check = await UserModel.findById(req.params.id);
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }
    const deleteUser = await UserModel.findByIdAndDelete(req.params.id);

    // delete previously uploaded images from cloudinary
    const initialImageArray = [];
    check.image.forEach((image) => {
      initialImageArray.push(image.public_id);
    });
    deleteUploads(initialImageArray);

    if (!deleteUser) {
      res.status(500);
      throw new Error("could not delete user");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "User deleted successfully.",
        "User deleted"
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

users.getbyid = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Users']
  const userDetail = await UserModel.findById(req.params.id);

  try {
    if (!userDetail) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "User found successfully.",
        userDetail
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

users.getall = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Users']
  // const getall = await UserModel.find();

  /** my edit */
  const searchRegex = new RegExp(req.query.search, "i");
  const statusRegex = new RegExp(req.query.status, "i");

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const getall = await UserModel.find({
    $and: [
      { status: { $regex: statusRegex } },
      {
        $or: [
          { username: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
        ]
      }
    ]
  })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalUsers = await UserModel.countDocuments({
    $and: [
      { status: { $regex: statusRegex } },
      {
        $or: [
          { username: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
        ]
      }
    ]
  });

  try {
    if (!getall) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(res, 200, "Users found successfully.", {
        data: getall,
        count: totalUsers,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default users;
