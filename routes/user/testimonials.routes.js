import testimonial from "../../controllers/user/testimonials.controllers.js";

import express from "express";
const testimonialRoutes = express.Router();

testimonialRoutes.post("/user/testimonial/create", testimonial.create);
testimonialRoutes.get("/user/testimonial/approved", testimonial.getApproved); // Returns the approved testimonials

export default testimonialRoutes;
