import users from "../../controllers/admin/users.controller.js";

import express from "express";
const usersRoutes = express.Router();

// for users
usersRoutes.post("/admin/create/user", users.register);
usersRoutes.put("/admin/update/user/:id", users.update);
usersRoutes.delete("/admin/delete/user/:id", users.delete);
usersRoutes.get("/admin/getbyid/user/:id", users.getbyid);
usersRoutes.get("/admin/getall/user", users.getall);

export default usersRoutes;
