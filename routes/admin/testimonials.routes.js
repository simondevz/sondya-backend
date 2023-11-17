import adminTestimonial from "../../controllers/admin/testimonials.controllers.js";

import express from "express";
const AdminTestimonialRoutes = express.Router();

// for Admin to edit, delete or approve testimonials
AdminTestimonialRoutes.get(
  "/admin/testimonial/unapproved",
  adminTestimonial.getUnapproved
);
AdminTestimonialRoutes.put(
  "/admin/testimonial/approve/:id",
  adminTestimonial.approve
);
AdminTestimonialRoutes.put(
  "/admin/testimonial/update",
  adminTestimonial.update
);
AdminTestimonialRoutes.delete(
  "/admin/testimonial/delete/:id",
  adminTestimonial.delete
);

export default AdminTestimonialRoutes;
