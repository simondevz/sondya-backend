import userReviews from "../../controllers/user/reviews.controllers.js";

import express from "express";
const reviewsRoutes = {};
reviewsRoutes.unprotected = express.Router();
reviewsRoutes.protected = express.Router();

reviewsRoutes.protected.post("/user/review", userReviews.createReview);
reviewsRoutes.unprotected.get(
  "/user/review/stat/:category/:id",
  userReviews.getStat
);
reviewsRoutes.unprotected.get(
  "/user/review/list/:category/:id",
  userReviews.listReviews
);

export default reviewsRoutes;
