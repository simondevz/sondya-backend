/* eslint-disable no-undef */
// importing express framework
import express from "express";
import expressWs from "express-ws";

const app = express();
const wss = expressWs(app).getWss();

// WebSockets
import wsController from "./controllers/groupchat/websocket.controllers.js";
wsController.use("/api/v1/ws/chat", app);
wsController.ping(wss);
wsController.clearUnused();

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
import AuthMiddleware from "./middleware/userMiddleware.js";

// importing Routes
import AdminCategoriesRoutes from "./routes/admin/categories.routes.js";
import AdminGroupChatRoutes from "./routes/admin/groupchat.routes.js";
import AdminProductsRoutes from "./routes/admin/products.routes.js";
import AdminServicesRoutes from "./routes/admin/services.routes.js";
import AdminTestimonialRoutes from "./routes/admin/testimonials.routes.js";
import testimonialRoutes from "./routes/user/testimonials.routes.js";
import AdminUsersRoutes from "./routes/admin/users.routes.js";
import SellerProductsRoutes from "./routes/seller/products.seller.routes.js";
import SellerServicesRoutes from "./routes/seller/services.seller.routes.js";

import profileRoutes from "./routes/profile.routes.js";

import authRoutes from "./routes/auth.routes.js";
import contactusRoutes from "./routes/contactus.routes.js";
import healthRoutes from "./routes/health.routes.js";
import groupchatRoutes from "./routes/groupchat/groupchat.routes.js";
import groupMembersRoutes from "./routes/groupchat/members.routes.js";
import groupMessagesRoutes from "./routes/groupchat/messages.routes.js";
import productsRoutes from "./routes/user/products.routes.js";
import ServicesRoutes from "./routes/user/services.routes.js";

// Running routes
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/v1/", contactusRoutes);
app.use("/api/v1/", healthRoutes);
app.use("/api/v1/", authRoutes);
app.use("/api/v1/", groupchatRoutes);
app.use("/api/v1/", productsRoutes);
app.use("/api/v1/", ServicesRoutes);
app.use("/api/v1/", groupMembersRoutes.unprotected);
app.use("/api/v1/", groupMessagesRoutes.unprotected);

//swagger inititailization
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// protected routes
app.use(AuthMiddleware.protectUser);

//admin protected
app.use("/api/v1/", AdminUsersRoutes);
app.use("/api/v1/", AdminCategoriesRoutes);
app.use("/api/v1/", AdminProductsRoutes);
app.use("/api/v1/", AdminServicesRoutes);
app.use("/api/v1/", AdminTestimonialRoutes);
app.use("/api/v1/", AdminGroupChatRoutes);

// seller protected
app.use("/api/v1/", SellerProductsRoutes);
app.use("/api/v1/", SellerServicesRoutes);

// user protected
app.use("/api/v1/", profileRoutes);
app.use("/api/v1/", testimonialRoutes);
app.use("/api/v1/", groupMembersRoutes.protected);
app.use("/api/v1/", groupMessagesRoutes.protected);

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
