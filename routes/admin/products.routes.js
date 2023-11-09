import upload from "../../config/file.js";
import adminProducts from "../../controllers/admin/admin-products.controllers.js";

import express from "express";
const AdminProductsRoutes = express.Router();

// for admin products
AdminProductsRoutes.post(
  "/admin/product/create",
  upload.array("image"),
  adminProducts.create
);
AdminProductsRoutes.put(
  "/admin/product/update/:id",
  upload.array("image"),
  adminProducts.update
);
AdminProductsRoutes.get("/admin/product/:id", adminProducts.getById);
AdminProductsRoutes.delete("/admin/product/:id", adminProducts.delete);
AdminProductsRoutes.get("/admin/products", adminProducts.getAll);

export default AdminProductsRoutes;
