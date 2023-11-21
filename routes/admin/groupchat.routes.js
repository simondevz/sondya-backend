import upload from "../../config/file.js";
import adminGroupChat from "../../controllers/admin/admin-groupchats.controllers.js";
import express from "express";
const AdminGroupChatRoutes = express.Router();

// for admin group chat routes
AdminGroupChatRoutes.post(
  "/admin/groupchat/create",
  upload.array("image"),
  adminGroupChat.create
);
AdminGroupChatRoutes.put(
  "/admin/groupchat/update",
  upload.array("image"),
  adminGroupChat.update
);
AdminGroupChatRoutes.get(
  "/admin/groupchat/list/:id", // Id of the admin that created the group chats we are getting
  adminGroupChat.getChats
);
AdminGroupChatRoutes.put(
  "/admin/groupchat/activate/:id",
  adminGroupChat.activate
);
AdminGroupChatRoutes.put(
  "/admin/groupchat/suspend/:id",
  adminGroupChat.suspend
);
AdminGroupChatRoutes.delete(
  "/admin/groupchat/delete/:id",
  adminGroupChat.delete
);

export default AdminGroupChatRoutes;
