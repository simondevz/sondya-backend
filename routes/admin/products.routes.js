import adminProducts from "../../controllers/admin/admin-products.controllers.js";

import express from "express";
const AdminProductsRoutes = express.Router();

// for admin products
AdminProductsRoutes.post("/admin/category/create", adminProducts.create);
AdminProductsRoutes.put("/admin/category/update/:id", adminProducts.update);
AdminProductsRoutes.get("/admin/category/:id", adminProducts.getById);
AdminProductsRoutes.delete("/admin/category/:id", adminProducts.delete);
AdminProductsRoutes.get("/admin/categories", adminProducts.getAll);

export default AdminProductsRoutes;
