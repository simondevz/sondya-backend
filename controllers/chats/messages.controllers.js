import ChatModel from "../../models/chat.model.js";
import responseHandle from "../../utils/handleResponse.js";
import asyncHandler from "express-async-handler";
import ChatMessageModel from "../../models/chatMessage.model.js";

const chatMessages = {};

chatMessages.getMessages = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Group Chat Handlers']
  const sender_id = req.query.sender_id;
  const receiver_id = req.query.receiver_id;
  const service_id = req.query.service_id || null;

  try {
    const chat = await ChatModel.findOne({
      $or: [
        { user1: sender_id, user2: receiver_id },
        { user1: receiver_id, user2: sender_id },
      ],
    })
      .populate("user1", ["username", "first_name", "last_name", "email"])
      .populate("user2", ["username", "first_name", "last_name", "email"])
      .lean();

    if (!chat?._id) {
      return responseHandle.successResponse(
        res,
        200,
        "Chat does not exist yet.",
        []
      );
    }

    const chatMessages = await ChatMessageModel.find({
      chat_id: chat._id,
      [service_id ? "service_id" : null]: service_id ? service_id : null,
    })
      .limit(50)
      .sort({ createAt: -1 })
      .populate("sender_id", ["username", "first_name", "last_name", "email"]);

    if (!chatMessages) {
      res.status(500);
      throw new Error("could not get Chat's messages");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Got Chat's messages successfully.",
        chatMessages
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

export default chatMessages;
