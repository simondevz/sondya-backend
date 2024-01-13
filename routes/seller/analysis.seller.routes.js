import SellerAnalysis from "../../controllers/seller/analysis.seller.controller.js";

import express from "express";
const SellerAnalysisRoutes = express.Router();

// for seller withdrawal
SellerAnalysisRoutes.get(
  "/seller/analysis/:id",
  SellerAnalysis.getDataAnalysis
);

export default SellerAnalysisRoutes;
