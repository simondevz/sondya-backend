import { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone_number: {
      type: String,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
      // required: true,
    },
    type: {
      type: String, // admin or user
    },
  },
  { timestamps: true }
);

const User = model("user", userSchema);
export default User;
