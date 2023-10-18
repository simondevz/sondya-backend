import asyncHandler from "express-async-handler";
import UserModel from "../models/users.model.js";
import tokenHandler from "../utils/handleToken.js";

/**
 * @description This middleware checks the user admin token supplied as Bearer authorization
 * @required Bearer Authorization
 */
const AuthMiddleware = {};

AuthMiddleware.protectUser = asyncHandler(async (req, res, next) => {
  let receivedToken = req.headers.authorization;
  let token;
  // console.log(receivedToken);
  //   const eMessage = "You are not authorized to use this service, token failed";

  if (receivedToken && receivedToken.startsWith("Bearer")) {
    try {
      token = receivedToken.split(" ")[1];

      const decoded = tokenHandler.decodeToken(token);

      const user = await UserModel.findOne({
        email: decoded.email,
      }).select("-password");

      if (!user) {
        res.status(401);
        throw new Error("You are not authorized to use this service yet. ");
      }

      req.user = user;
    } catch (error) {
      res.status(401);
      throw new Error(error);
    }
  }

  if (!token) {
    res.status(401);
    throw new Error(
      "You are not authorized to use this service, no token provided."
    );
  }
  next();
});

export default AuthMiddleware;
