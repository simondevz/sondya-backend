import upload from "../../config/file.js";
import express from "express";
import chatMessages from "../../controllers/chats/messages.controllers.js";

const chatMessagesRoutes = express.Router();
chatMessagesRoutes.get("/chat/messages", chatMessages.getMessages);
chatMessagesRoutes.post(
  "/chat/send/message",
  upload.array("file_attachments"),
  chatMessages.sendFiles
);
export default chatMessagesRoutes;
