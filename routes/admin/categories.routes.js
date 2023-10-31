import adminCategories from "../../controllers/admin/admin-categories.controllers.js";

import express from "express";
const AdminCategoriesRoutes = express.Router();

// for admin categories
AdminCategoriesRoutes.post("/admin/category/create", adminCategories.create);
AdminCategoriesRoutes.put("/admin/category/update/:id", adminCategories.update);
AdminCategoriesRoutes.get("/admin/category/:id", adminCategories.getById);
AdminCategoriesRoutes.delete("/admin/category/:id", adminCategories.delete);
AdminCategoriesRoutes.get("/admin/categories", adminCategories.getAll);

export default AdminCategoriesRoutes;
