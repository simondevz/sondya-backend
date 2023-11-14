import { Schema, model } from "mongoose";

const contactUsSchema = Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const ContactUs = model("contact_us", contactUsSchema);
export default ContactUs;
