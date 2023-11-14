import { Schema, model } from "mongoose";

const testimonialSchema = Schema(
  {
    user_id: {
      type: String,
    },
    name: {
      type: String,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

const Testimonial = model("testimonials", testimonialSchema);
export default Testimonial;
