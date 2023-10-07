/* eslint-disable no-undef */
import { sign, verify } from "jsonwebtoken";

// @ts-ignore
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET;

const tokenHandler = {};

tokenHandler.generateToken = (fieldToSecure, duration) => {
  try {
    return sign({ fieldToSecure }, secret, {
      expiresIn: duration ? duration : 18408600000,
    });
  } catch (error) {
    throw new Error(error);
  }
};

tokenHandler.decodeToken = (res, token) => {
  try {
    return verify(token, secret);
  } catch (error) {
    res.status(422);
    throw new Error(error);
  }
};

export default tokenHandler;
