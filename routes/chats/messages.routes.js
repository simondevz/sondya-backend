import express from "express";
import chatMessages from "../../controllers/chats/messages.controllers.js";

const chatMessagesRoutes = express.Router();
chatMessagesRoutes.get("/chat/messages", chatMessages.getMessages);
export default chatMessagesRoutes;
