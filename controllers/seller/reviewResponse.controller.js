import asyncHandler from "express-async-handler";
import responseHandle from "../../utils/handleResponse.js";
import ReviewModel from "../../models/reviews.model.js";
import ReviewResponseModel from "../../models/reviewResponse.model.js";
import UserModel from "../../models/users.model.js";

const sellerReviewResponse = {};

sellerReviewResponse.createResponse = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller Reviews Response']
  try {
    const { user_id, review_id, response } = req.body;

    const check = await UserModel.findById(user_id).lean();
    if (!check?._id) {
      res.status(400);
      throw new Error("No user with id found");
    }

    const checkReview = await ReviewModel.findById(review_id).lean();
    if (!checkReview?._id) {
      res.status(400);
      throw new Error("Review not found");
    }

    if (!response) {
      res.status(400);
      throw new Error("You must provide a response");
    }

    let reviewResponse = await ReviewResponseModel.create({
      user_id,
      response,
      review_id,
    });

    if (!reviewResponse?._id) {
      res.status(500);
      throw new Error("could not create response");
    }

    responseHandle.successResponse(
      res,
      201,
      "Response created successfully.",
      reviewResponse
    );
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

export default sellerReviewResponse;
