import asyncHandler from "express-async-handler";
import UserModel from "../../models/users.model.js";
import responseHandle from "../../utils/handleResponse.js";

const users = {};

users.create = asyncHandler(async (req, res) => {
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
  const check = await UserModel.findById(req.params.id);
  const { first_name, last_name, username, email, password } = req.body;
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
        password: password,
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
  const check = await UserModel.findById(req.params.id);
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }
    const deleteUser = await UserModel.findByIdAndDelete(req.params.id);

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
  const getall = await UserModel.find();

  try {
    if (!getall) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Users found successfully.",
        getall
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default users;
