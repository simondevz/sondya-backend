import express from "express";
import groupChat from "../../controllers/groupchat/groupchat.controllers.js";

const groupchatRoutes = express.Router();

groupchatRoutes.get("/groupchats", groupChat.getChats);
groupchatRoutes.get("/groupchat/:group_id", groupChat.getChat);

export default groupchatRoutes;
