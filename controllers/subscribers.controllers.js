import asyncHandler from "express-async-handler";
import responseHandle from "../utils/handleResponse.js";
import SubscribersModel from "../models/Subscribers.model.js";
import { validate } from "email-validator";

const Subscribers = {};

Subscribers.getSubscribers = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Subcribe to Newsletter']
  try {
    const searchRegex = new RegExp(req.query.search, "i");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const subscribers = await SubscribersModel.find({
      $or: [{ email: { $regex: searchRegex } }],
    })
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await SubscribersModel.countDocuments({
      $or: [{ email: { $regex: searchRegex } }],
    });

    if (!subscribers) {
      res.status(500);
      throw new Error("could not retrieve subscribers");
    }

    responseHandle.successResponse(
      res,
      201,
      "Retrieved Subscribers successfully.",
      { subscribers, count }
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

Subscribers.suscribe = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Subcribe to Newsletter']
  try {
    const email = req.body.email;
    if (!validate(email)) {
      res.status(400);
      throw new Error("Invalid Email");
    }

    const check = await SubscribersModel.findOne({ email }).lean();
    if (check) {
      res.status(400);
      throw new Error("Email already Subscribed");
    }

    const subscriber = await SubscribersModel.create({ email });

    if (!subscriber) {
      res.status(500);
      throw new Error("could not subscribe");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Suscribed successfully.",
        subscriber
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default Subscribers;
