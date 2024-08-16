import asyncHandler from "express-async-handler";
import GroupChatModel from "../../models/groupchat.model.js";
import GroupMessageModel from "../../models/groupMessage.model.js";
import LikesModel from "../../models/likes.model.js";
import UserModel from "../../models/users.model.js";
import responseHandle from "../../utils/handleResponse.js";
import handleUpload from "../../utils/upload.js";
import custom_format from "../chats/messages.controllers.js";

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
        $sort: { createdAt: -1 },
      },
      {
        $limit: 50,
      },
      {
        $project: {
          message: 1,
          group_id: 1,
          sender_id: 1,
          image: 1,
          file: 1,
          file_extension: 1,
          file_size: 1,
          file_name: 1,
          type: 1,
          createdAt: 1, // Include createdAt field
          likes: "$likes.user_id", // Extract user_ids from the 'likes' array
        },
      },
    ]);

    await Promise.all(
      groupMessages.map(async (message) => {
        const sender = await UserModel.findById(message.sender_id).select(
          "username first_name last_name email"
        );
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

groupMessages.sendMessage = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Group Chat Handlers']
  const { message, group_id, sender_id } = req.body;

  try {
    const check = await GroupChatModel.findById(group_id);
    if (!check) {
      res.status(404);
      throw new Error("Message not found");
    }

    const user = await UserModel.findById(sender_id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // start of uploading files
    let fileUrl = "null";
    if (req.files && req.files.length > 0) {
      // upload images to cloudinary
      let files = req?.files;
      // console.log(files);
      let multipleFilePromise = files.map(async (file, index) => {
        // eslint-disable-next-line no-undef
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(
          dataURI,
          index,
          file.mimetype,
          file.originalname
        );
        cldRes.custom_format = custom_format[file?.mimetype];
        cldRes.custom_filename = file.originalname;
        return cldRes;
      });

      // get url of uploaded images
      const fileResponse = await Promise.all(multipleFilePromise);
      fileUrl = fileResponse.map((file) => {
        const url = file.secure_url;
        const public_id = file.public_id;
        const folder = file.folder;
        return {
          url,
          public_id,
          folder,
          format: file.custom_format,
          filename: file.custom_filename,
        };
      });
    }
    // end of uploading files

    let newMessage;

    // check if there is a file
    const isNewfile = req.files && req.files.length > 0 ? true : false;

    // create new message
    (isNewfile && req.files?.[0].mimetype === "image/jpeg") ||
    (isNewfile && req.files?.[0].mimetype === "image/png")
      ? (newMessage = await GroupMessageModel.create({
          message: message,
          group_id: group_id,
          sender_id: sender_id,
          type: "image",
          file_name: req.files?.[0].originalname,
          image: fileUrl,
        }))
      : (newMessage = await GroupMessageModel.create({
          message: fileUrl === "null" ? message : "file",
          group_id: group_id,
          sender_id: sender_id,
          type: fileUrl === "null" ? "text" : "file",
          [fileUrl === "null" ? null : "file_name"]:
            req.files?.[0].originalname,
          [fileUrl === "null" ? null : "file_extension"]:
            req.files?.[0].mimetype,
          [fileUrl === "null" ? null : "file_size"]: req.files?.[0].size,
          [fileUrl === "null" ? null : "file"]: fileUrl,
        }));

    if (!newMessage) {
      res.status(500);
      throw new Error("could not send message");
    } else {
      responseHandle.successResponse(
        res,
        201,
        "Message sent successfully.",
        newMessage
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});
export default groupMessages;
