import express from "express";
import Chat from "../../controllers/chats/chat.controllers.js";

const chatRoutes = express.Router();

chatRoutes.get("/chats/:user_id", Chat.getChats);
chatRoutes.get("/chat", Chat.getChat);

export default chatRoutes;
