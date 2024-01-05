import { Schema, model } from "mongoose";

const subscribersSchema = Schema(
  {
    email: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const Subscribers = model("subscribers", subscribersSchema);
export default Subscribers;
