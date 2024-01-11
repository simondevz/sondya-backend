import asyncHandler from "express-async-handler";
import randomstring from "randomstring";
import UserModel from "../models/users.model.js";
import {
  sendForgotPasswordEmail,
  sendWelcomeEmail,
} from "../services/users.services.js";
import responseHandle from "../utils/handleResponse.js";
import tokenHandler from "../utils/handleToken.js";

const auth = {};

auth.register = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Authentication']
  const {
    first_name,
    last_name,
    username,
    email,
    password,
    country,
    referrer,
  } = req.body;
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
      res.status(400);
      throw new Error("Username is taken");
    }

    const newUser = await UserModel.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim().toLowerCase(),
      password: password.trim(),
      country: country.trim(),
      referrer: referrer.trim().toLowerCase(),
      type: "user",
    });

    if (!newUser) {
      res.status(500);
      throw new Error("could not register user");
    } else {
      sendWelcomeEmail(email.trim());
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
  // #swagger.tags = ['Authentication']
  const { email, password } = req.body;

  try {
    const exists = await UserModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!exists || (await exists.matchPassword(password)) === false) {
      res.status(400);
      throw new Error("Invalid username or password");
    }

    responseHandle.successResponse(res, "200", "Login success", {
      // email: exists.email,
      type: exists.type,
      token: tokenHandler.generateToken(
        {
          id: exists.id,
          email: exists.email,
          type: exists.type,
          username: exists.username,
        },
        "1d"
      ),
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

auth.forgotPassword = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Authentication']
  const { email } = req.body;

  try {
    const exists = await UserModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!exists) {
      res.status(400);
      throw new Error("You are not a registered user");
    }

    // Generate a 4-digit verification code
    const verificationCode = randomstring.generate({
      length: 4,
      charset: "numeric",
    });
    const message = sendForgotPasswordEmail(email.trim(), verificationCode);

    const filter = { email: email.trim() };
    const update = { forgot_password_code: verificationCode };
    const updateCode = await UserModel.findOneAndUpdate(filter, update);
    if (!updateCode) {
      res.status(400);
      throw new Error("The code was not added. Please try again");
    }

    responseHandle.successResponse(
      res,
      "200",
      "Message sent! Please check spam if you didn't recieve the message",
      {
        message: message,
        email: exists.email.trim(),
      }
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

auth.verifyEmailCode = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Authentication']
  const email = req.params.email;
  const { code } = req.body;

  try {
    const exists = await UserModel.findOne({
      email: email.trim(),
    });

    // check if email exist
    if (!exists) {
      res.status(400);
      throw new Error("You are not a registered user");

      // check if codes match
    } else if (code.trim() !== exists.forgot_password_code) {
      res.status(400);
      throw new Error("Codes dont match");
    }

    responseHandle.successResponse(res, "200", "email verified successfully", {
      email: exists.email.trim(),
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

auth.resetPassword = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Authentication']
  const email = req.params.email;
  const { password, confirm_password } = req.body;

  try {
    const exists = await UserModel.findOne({
      email: email.trim().toLowerCase(),
    });

    // check if email exist
    if (!exists) {
      res.status(400);
      throw new Error("email doesn't exist");
    }

    if (password !== confirm_password) {
      res.status(400);
      throw new Error("Passwords doesn't match");
    }

    exists.password = password;
    const resetPassword = await exists.save();

    if (!resetPassword) {
      res.status(400);
      throw new Error("The password was not updated. Please try again");
    }

    responseHandle.successResponse(
      res,
      "200",
      "password updated successfully",
      {
        email: exists.email,
      }
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default auth;
