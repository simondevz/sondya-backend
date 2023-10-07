/* eslint-disable no-undef */
// importing express framework
import express from "express";
const app = express();

// importing .env parser
import dotenv from "dotenv";
dotenv.config();

// importing monogodb database
import connectDB from "./config/db.js";
connectDB();

// importing middlewares
import bodyParser from "body-parser";
import cors from "cors";
// const { protectUser } = require("./middleware/userMiddleware"); // Auth Middlewares

// Routes
import healthRoutes from "./routes/health.routes.js";

// Running routes
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/v1/", healthRoutes);

// // protected routes
// app.use(protectUser);
// app.use("/api/", adminRoutes);

// Error Middlewares
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

//Not found URL middleware
app.use(notFound);

//Error handler for the whole app
app.use(errorHandler);

//initializing server
app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
