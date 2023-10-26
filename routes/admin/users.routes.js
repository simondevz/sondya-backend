import users from "../../controllers/admin/users.controller.js";

import express from "express";
const AdminUsersRoutes = express.Router();

// for users
AdminUsersRoutes.post("/admin/user/create", users.create);
AdminUsersRoutes.put("/admin/user/update/:id", users.update);
AdminUsersRoutes.delete("/admin/user/delete/:id", users.delete);
AdminUsersRoutes.get("/admin/user/get/:id", users.getbyid);
AdminUsersRoutes.get("/admin/users", users.getall);

export default AdminUsersRoutes;
