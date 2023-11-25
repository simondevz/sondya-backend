import GroupChatModel from "../../models/groupchat.model.js";
import responseHandle from "../../utils/handleResponse.js";
import asyncHandler from "express-async-handler";
import UserModel from "../../models/users.model.js";
import GroupMessageModel from "../../models/groupMessage.model.js";
import LikesModel from "../../models/likes.model.js";

const groupMessages = {};

groupMessages.getMessages = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Group Chat Handlers']
  const group_id = req.params.group_id;
  const dateThreshold = new Date();

  try {
    const check = await GroupChatModel.findById(group_id);
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    // This to includes list of user_ids that have liked the message
    const groupMessages = await GroupMessageModel.aggregate([
      {
        $match: {
          createdAt: { $lte: dateThreshold },
          group_id: check._id,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "message_id",
          as: "likes",
        },
      },
      {
        $limit: 50,
      },
      {
        $project: {
          message: 1,
          group_id: 1,
          sender_id: 1,
          createdAt: 1, // Include createdAt field
          likes: "$likes.user_id", // Extract user_ids from the 'likes' array
        },
      },
    ]);

    await Promise.all(
      groupMessages.map(async (message) => {
        // todo: Reduce to only get usefull fields
        const sender = await UserModel.findById(message.sender_id);
        message.sender = sender;
      })
    );

    if (!groupMessages) {
      res.status(500);
      throw new Error("could not get group's messages");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Got Groups messages successfully.",
        groupMessages
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

// groupMessages.sendMessage = asyncHandler(async (req, res) => {
//   // #swagger.tags = ['Group Chat Handlers']
//   const { group_id, message, sender_id } = req.body;

//   try {
//     const check = await GroupChatModel.findById(group_id);
//     if (!check) {
//       res.status(404);
//       throw new Error("Id not found");
//     }

//     const user = await UserModel.findById(sender_id);
//     if (!user) {
//       res.status(404);
//       throw new Error("User not found");
//     }

//     if (!message) {
//       res.status(400);
//       throw new Error("No message");
//     }

//     // Todo: send the message to websocket group too
//     const groupMessage = await GroupMessageModel.create({
//       group_id,
//       message,
//       sender_id,
//     });

//     if (!groupMessage) {
//       res.status(500);
//       throw new Error("could not send message");
//     } else {
//       responseHandle.successResponse(
//         res,
//         201,
//         "Sent message successfully.",
//         groupMessage
//       );
//     }
//   } catch (error) {
//     res.status(500);
//     console.log(error);
//     throw new Error(error);
//   }
// });

groupMessages.likeMessage = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Group Chat Handlers']
  const { message_id, user_id } = req.body;

  try {
    const check = await GroupMessageModel.findById(message_id);
    if (!check) {
      res.status(404);
      throw new Error("Message not found");
    }

    const user = await UserModel.findById(user_id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    let like = await LikesModel.find({ message_id, user_id });

    // if user has liked this message already delete the like
    if (like.length) {
      like = await LikesModel.findByIdAndDelete(like?.[0]._id);

      if (!like) {
        res.status(500);
        throw new Error("could not unlike message");
      } else {
        responseHandle.successResponse(
          res,
          200,
          "Unliked message successfully.",
          like
        );
      }
      return;
    }

    like = await LikesModel.create({ message_id, user_id });
    if (!like) {
      res.status(500);
      throw new Error("could not like message");
    } else {
      responseHandle.successResponse(
        res,
        201,
        "Like message successfully.",
        like
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

export default groupMessages;
