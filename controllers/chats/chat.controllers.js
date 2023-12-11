import ChatModel from "../../models/chat.model.js";
import ChatMessageModel from "../../models/chatMessage.model.js";
import responseHandle from "../../utils/handleResponse.js";
import asyncHandler from "express-async-handler";

const Chat = {};

Chat.getChats = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Group Chat Handlers']
  const user_id = req.params.user_id;
  try {
    const Chats = await ChatModel.find({
      $or: [{ user1: user_id }, { user2: user_id }],
    })
      .populate("user1", [
        "username",
        "first_name",
        "last_name",
        "email",
        "image",
      ])
      .populate("user2", [
        "username",
        "first_name",
        "last_name",
        "email",
        "image",
      ])
      .lean();

    await Promise.all(
      Chats.map(async (chat) => {
        const messages = await ChatMessageModel.find({ chat_id: chat._id })
          .sort({ createdAt: -1 })
          .limit(10);
        chat.messages = messages;
      })
    );

    if (!Chats) {
      res.status(500);
      throw new Error("could not retrieve chats");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Chats gotten successfully.",
        Chats
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

Chat.getChat = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Group Chat Handlers']
  const sender_id = req.query.sender_id;
  const receiver_id = req.query.receiver_id;

  try {
    const Chat = await ChatModel.findOne({
      $or: [
        { user1: sender_id, user2: receiver_id },
        { user1: receiver_id, user2: sender_id },
      ],
    })
      .populate("user1", ["username", "first_name", "last_name", "email"])
      .populate("user2", ["username", "first_name", "last_name", "email"]);

    if (!Chat) {
      res.status(500);
      throw new Error("could not retrieve chat");
    } else {
      responseHandle.successResponse(res, 200, "Chat gotten successfully.", {
        chat: Chat,
      });
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

export default Chat;
