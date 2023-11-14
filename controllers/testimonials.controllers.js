import asyncHandler from "express-async-handler";
import TestimonialModel from "../models/testimonials.models.js";

const testimonial = {};

testimonial.create = asyncHandler(async (req, res) => {
  const { user_id, name, title, date, content } = req.body;
  try {
    //  check that the data sent is complete and valid
    if (!user_id || !name || !title || !date || !content) {
      res.status(400);
      res.send({ message: "Invalid Request" });
      return;
    }

    // store in db
    const data = new TestimonialModel({
      user_id,
      name,
      title,
      date,
      content,
    });
    res.status(201).send({ data, message: "Created" });
    return;
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default testimonial;
