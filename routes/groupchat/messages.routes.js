import express from "express";
import upload from "../../config/file.js";
import groupMessages from "../../controllers/groupchat/messages.controllers.js";

const groupMessagesRoutes = {};
groupMessagesRoutes.protected = express.Router();
groupMessagesRoutes.unprotected = express.Router();

groupMessagesRoutes.protected.post(
  "/groupchat/messages/like",
  groupMessages.likeMessage
);

// should be off soon
groupMessagesRoutes.protected.post(
  "/groupchat/messages/send",
  upload.array("file_attachments"),
  groupMessages.sendMessage
);

groupMessagesRoutes.unprotected.get(
  "/groupchat/messages/:group_id",
  groupMessages.getMessages
);

export default groupMessagesRoutes;
