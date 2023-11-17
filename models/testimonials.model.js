import { Schema, model } from "mongoose";

const testimonialSchema = Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
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
    status: {
      type: String, // approved or not approved
      default: "not approved",
    },
  },
  { timestamps: true }
);

const Testimonial = model("testimonials", testimonialSchema);
export default Testimonial;
