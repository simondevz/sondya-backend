import health from "../controllers/health.controllers.js";

import express from "express";
const healthRoutes = express.Router();

healthRoutes.get("/health", health.Get);
healthRoutes.post("/health", health.Post);

export default healthRoutes;
