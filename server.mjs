/* eslint-disable no-undef */
// importing express framework
import express from "express";
const app = express();

// importing swagger ui
import { readFileSync } from "fs";
import swaggerUi from "swagger-ui-express";

// Read the JSON file synchronously
const rawData = readFileSync("./swagger/swagger_output.json", "utf-8");
const swaggerFile = JSON.parse(rawData);

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
import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";

// Running routes
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/v1/", healthRoutes);
app.use("/api/v1/", authRoutes);

//swagger inititailization
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// // protected routes
// app.use(protectUser);
// app.use("/api/", adminRoutes);

// Error Middlewares
import errorMiddleware from "./middleware/errorMiddleware.js";

//Not found URL middleware
app.use(errorMiddleware.notFound);

//Error handler for the whole app
app.use(errorMiddleware.errorHandler);

//initializing server
app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
