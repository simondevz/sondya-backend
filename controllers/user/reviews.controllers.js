import asyncHandler from "express-async-handler";
import responseHandle from "../../utils/handleResponse.js";
import ReviewModel from "../../models/reviews.model.js";
import UserModel from "../../models/users.model.js";
import responseModel from "../../models/reviewResponse.model.js";
import ProductModel from "../../models/products.model.js";
import ServiceModel from "../../models/services.model.js";

const userReviews = {};

userReviews.createReview = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Reviews']
  try {
    const { user_id, product_id, service_id, review, rating } = req.body;

    const check = await UserModel.findById(user_id).lean();
    if (!check?._id) {
      res.status(400);
      throw new Error("No user with id found");
    }

    if (!(product_id || service_id)) {
      res.status(400);
      throw new Error("You must be reviewing either a product or service");
    }

    if (!rating) {
      res.status(400);
      throw new Error("You must rate the product or service");
    }

    let newReview = await ReviewModel.create({
      user_id,
      review,
      rating,
      product_id,
      service_id,
    });

    if (product_id) {
      const reviews = await ReviewModel.find({
        product_id,
      }).lean();
      const totalReviews = reviews.length;
      const average = (() => {
        if (totalReviews === 0) return 0;
        let sum = 0;
        for (const review of reviews) {
          sum += review.rating;
        }
        return (sum / totalReviews).toFixed(2);
      })();

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        product_id,
        {
          rating: average,
          total_rating: totalReviews,
        },
        { new: true }
      );
      if (!updatedProduct) {
        res.status(500);
        throw new Error("Could not update product rating");
      }
    }

    if (service_id) {
      const reviews = await ReviewModel.find({
        service_id,
      }).lean();
      const totalReviews = reviews.length;
      const average = (() => {
        if (totalReviews === 0) return 0;
        let sum = 0;
        for (const review of reviews) {
          sum += review.rating;
        }
        return (sum / totalReviews).toFixed(2);
      })();

      const updatedService = await ServiceModel.findByIdAndUpdate(
        service_id,
        {
          rating: average,
          total_rating: totalReviews,
        },
        { new: true }
      );
      if (!updatedService) {
        res.status(500);
        throw new Error("Could not update service rating");
      }
    }

    const returnReview = {
      ...newReview?._doc,
      user_id: {
        _id: check?._id,
        username: check?.username,
        email: check?.email,
        image: check?.image,
      },
    };

    if (!newReview?._id) {
      res.status(500);
      throw new Error("could not create review");
    }

    responseHandle.successResponse(
      res,
      201,
      "Review created successfully.",
      returnReview
    );
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

userReviews.getStat = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Reviews']
  try {
    const { category, id } = req.params;

    if (!(id || category)) {
      res.status(404);
      throw new Error("Path not found");
    }

    const reviews = await ReviewModel.find({
      [category === "service" ? "service_id" : "product_id"]: id,
    }).lean();
    const totalReviews = reviews.length;
    const average = (() => {
      if (totalReviews === 0) return 0;
      let sum = 0;
      for (const review of reviews) {
        sum += review.rating;
      }
      return (sum / totalReviews).toFixed(2);
    })();

    responseHandle.successResponse(
      res,
      201,
      "Review Stat retrieved successfully.",
      {
        averageRating: Number(average),
        totalReviews,
      }
    );
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

userReviews.listReviews = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Reviews']
  try {
    const { category, id } = req.params;
    const searchRegex = new RegExp(req.query.search, "i");
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    if (!(id || category)) {
      res.status(404);
      throw new Error("Path not found");
    }

    const reviews = await ReviewModel.find({
      [category === "service" ? "service_id" : "product_id"]: id,
      review: req.query?.search
        ? { $regex: searchRegex }
        : { $exists: true, $ne: "" },
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user_id", ["username", "email", "image"])
      .lean();

    await Promise.all(
      reviews.map(async (review) => {
        const responses = await responseModel.find({ review_id: review?._id });
        review.responses = responses;
      })
    );

    responseHandle.successResponse(
      res,
      201,
      "Reviews retrieved successfully.",
      reviews
    );
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

export default userReviews;
