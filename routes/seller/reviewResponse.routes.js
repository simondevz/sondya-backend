import sellerReviewResponse from "../../controllers/seller/reviewResponse.controller.js";

import express from "express";
const reviewResponseRoutes = express.Router();

reviewResponseRoutes.post(
  "/seller/review/response",
  sellerReviewResponse.createResponse
);

export default reviewResponseRoutes;
