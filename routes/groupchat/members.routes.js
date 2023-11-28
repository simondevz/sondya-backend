import express from "express";
import groupMembers from "../../controllers/groupchat/members.controllers.js";

const groupMembersRoutes = {};
groupMembersRoutes.protected = express.Router();
groupMembersRoutes.unprotected = express.Router();

groupMembersRoutes.protected.post(
  "/groupchat/members/join",
  groupMembers.joinChat
);
groupMembersRoutes.protected.get(
  "/user/groupchats/:user_id",
  groupMembers.getUserGroupChats
);
groupMembersRoutes.unprotected.get(
  "/groupchat/members/:group_id",
  groupMembers.getMembers
);

export default groupMembersRoutes;
