/* eslint-disable no-undef */

// import { connect, set } from "mongoose";

// import { connect, set } from "mongoose";

import { connect, set } from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    set("strictQuery", false);
    const connection = await connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
