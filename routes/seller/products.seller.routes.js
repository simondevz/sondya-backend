import upload from "../../config/file.js";
import SellerProducts from "../../controllers/seller/products.seller.controller.js";

import express from "express";
const SellerProductsRoutes = express.Router();

// for seller products
SellerProductsRoutes.post(
  "/seller/product/create",
  upload.array("image"),
  SellerProducts.create
);
SellerProductsRoutes.put(
  "/seller/product/update/:id",
  upload.array("image"),
  SellerProducts.update
);
SellerProductsRoutes.get("/seller/product/:userId/:id", SellerProducts.getById);
SellerProductsRoutes.delete("/seller/product/:id", SellerProducts.delete);
SellerProductsRoutes.get("/seller/products", SellerProducts.getAll);

export default SellerProductsRoutes;
