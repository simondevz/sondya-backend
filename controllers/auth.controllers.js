import asyncHandler from "express-async-handler";
import UserModel from "../models/users.model";
import responseHandle from "../utils/handleResponse";
import tokenHandler from "../utils/handleToken";

const auth = {};

auth.register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const emailTaken = await UserModel.findOne({ email });
    if (emailTaken) {
      res.status(400);
      throw new Error("Email is taken");
    }
    const usernameTaken = await UserModel.findOne({
      username: username.trim(),
    });

    if (usernameTaken) {
      res.status(404);
      throw new Error("Username is taken");
    }

    const newUser = await UserModel.create({
      name: name.trim(),
      email: email.trim(),
      username: username.trim(),
      password: password.trim(),
    });

    if (!newUser) {
      res.status(500);
      throw new Error("could not register user");
    } else {
      responseHandle.successResponse(
        res,
        201,
        "Account created successfully.",
        newUser
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

auth.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  try {
    const exists = await UserModel.findOne({
      username: username.trim(),
      password: password.trim(),
    });

    if (!exists) {
      res.status(400);
      throw new Error("Invalid username or password");
    }

    responseHandle.successResponse(res, "200", "Login success", {
      username: exists.username,
      token: tokenHandler.generateToken(res, username),
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default auth;
