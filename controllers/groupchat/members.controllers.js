import GroupChatModel from "../../models/groupchat.model.js";
import responseHandle from "../../utils/handleResponse.js";
import asyncHandler from "express-async-handler";
import GroupMembershipModel from "../../models/groupMembership.model.js";
import UserModel from "../../models/users.model.js";

const groupMembers = {};

groupMembers.getMembers = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Group Chat Handlers']
  const group_id = req.params.group_id;

  try {
    const check = await GroupChatModel.findById(group_id);
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    const members = await GroupMembershipModel.find({ group_id }).populate(
      "user_id",
      ["email", "username", "image"]
    );

    if (!members) {
      res.status(500);
      throw new Error("could not get group members");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Got Group mmembers successfully.",
        members
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

groupMembers.getUserGroupChats = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Group Chat Handlers']
  const user_id = req.params.user_id;

  try {
    const check = await UserModel.findById(user_id);
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    const groups = await GroupMembershipModel.find({ user_id });
    if (!groups) {
      res.status(500);
      throw new Error("could not get user's groups");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Got User's Groups successfully.",
        groups
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

groupMembers.joinChat = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Group Chat Handlers']
  const { group_id, user_id } = req.body;
  try {
    const check = await GroupChatModel.findById(group_id);
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    const user = await UserModel.findById(user_id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const inGroup = await GroupMembershipModel.find({ group_id, user_id });

    if (inGroup?.length) {
      res.status(400);
      throw new Error("User already a group member");
    }

    const groupMembership = await GroupMembershipModel.create({
      user_id,
      group_id,
    });

    if (!groupMembership) {
      res.status(500);
      throw new Error("could not join group");
    } else {
      responseHandle.successResponse(
        res,
        201,
        "Joined group successfully.",
        groupMembership
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

export default groupMembers;
