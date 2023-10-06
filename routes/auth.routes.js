const auth = require("../controllers/health.controllers");
const authRoutes = require("express").Router();

// Basic Auth
authRoutes.post("/register", health.Post);
authRoutes.post("/login", health.Post);
authRoutes.post("/forgotpassword", health.Post);

// Profile
authRoutes.post("/profile", health.Post);

module.exports = authRoutes;
