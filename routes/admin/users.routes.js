import users from "../../controllers/admin/users.controller.js";

import express from "express";
const AdminUsersRoutes = express.Router();

// for users
AdminUsersRoutes.post("/admin/create/user", users.create);
AdminUsersRoutes.put("/admin/update/user/:id", users.update);
AdminUsersRoutes.delete("/admin/delete/user/:id", users.delete);
AdminUsersRoutes.get("/admin/getbyid/user/:id", users.getbyid);
AdminUsersRoutes.get("/admin/getall/user", users.getall);

export default AdminUsersRoutes;
