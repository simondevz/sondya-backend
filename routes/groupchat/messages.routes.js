import express from "express";
import groupMessages from "../../controllers/groupchat/messages.controllers.js";

const groupMessagesRoutes = {};
groupMessagesRoutes.protected = express.Router();
groupMessagesRoutes.unprotected = express.Router();

groupMessagesRoutes.protected.post(
  "/groupchat/messages/like",
  groupMessages.likeMessage
);
// groupMessagesRoutes.protected.post(
//   "/groupchat/messages/send",
//   groupMessages.sendMessage
// );
groupMessagesRoutes.unprotected.get(
  "/groupchat/messages/:group_id",
  groupMessages.getMessages
);

export default groupMessagesRoutes;
