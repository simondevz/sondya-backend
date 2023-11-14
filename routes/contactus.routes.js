import ContactUs from "../controllers/contactus.controllers.js";

import express from "express";
const contactusRoutes = express.Router();

contactusRoutes.post("/contactus", ContactUs.create);

export default contactusRoutes;
