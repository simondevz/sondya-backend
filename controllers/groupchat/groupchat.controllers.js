import GroupChatModel from "../../models/groupchat.model.js";
import responseHandle from "../../utils/handleResponse.js";
import asyncHandler from "express-async-handler";

const groupChat = {};

groupChat.getChats = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Group Chat Handlers']
  try {
    const searchRegex = new RegExp(req.query.search, "i");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const groupChats = await GroupChatModel.aggregate([
      {
        $lookup: {
          from: "groupMessage",
          let: { group_id: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$group_id", "$$group_id"] } } },
            { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
            { $limit: 10 }, // Get the last 10 messages
          ],
          as: "messages",
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
          ],
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const count = await GroupChatModel.countDocuments({
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ],
    });

    if (!groupChats) {
      res.status(500);
      throw new Error("could not retrieve groupchats");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Group Chats gotten successfully.",
        { groupChats, count }
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

groupChat.getChat = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Group Chat Handlers']
  const group_id = req.params.group_id;
  try {
    const groupChat = await GroupChatModel.findById(group_id).populate(
      "admin_id",
      ["username", "first_name", "last_name", "email"]
    );

    if (!groupChat) {
      res.status(500);
      throw new Error("could not retrieve groupchat");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Group Chat gotten successfully.",
        groupChat
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

export default groupChat;
