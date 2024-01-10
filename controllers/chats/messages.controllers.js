import ChatModel from "../../models/chat.model.js";
import responseHandle from "../../utils/handleResponse.js";
import asyncHandler from "express-async-handler";
import handleUpload from "../../utils/upload.js";
import ChatMessageModel from "../../models/chatMessage.model.js";
import UserModel from "../../models/users.model.js";

const custom_format = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/x-matroska": "mkv",
  "video/avi": "avi",
  "video/quicktime": "mov",
  "audio/wav": "wav",
  "audio/mpeg": "mp3",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
  "text/plain": "txt",
  "text/csv": "csv",
};

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

chatMessages.sendMessage = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Chat File Handlers']
  const message_text = req.body?.message_text;
  const receiver_id = req.body?.receiver_id;
  const sender_id = req.body.sender_id;
  const product_id = req.body?.product_id;
  const service_id = req.body?.service_id;

  console.log("form data => ", {
    message_text,
    receiver_id,
    sender_id,
    product_id,
    service_id,
  });

  try {
    const sender = await UserModel.findById(sender_id).lean();
    if (!sender?._id) {
      res.status(400);
      throw new Error(
        "The ID of the person sending this message was not found"
      );
    }

    const receiver = await UserModel.findById(receiver_id).lean();
    if (!receiver?._id) {
      res.status(400);
      throw new Error(
        "The ID of the person recieving this message was not found"
      );
    }

    let chat = await ChatModel.findOne({
      $or: [
        { user1: sender_id, user2: receiver_id },
        { user1: receiver_id, user2: sender_id },
      ],
    });

    if (!chat) {
      chat = await ChatModel.create({
        user1: sender_id,
        user2: receiver_id,
      });
    }

    let fileUrl = "null";
    if (req.files.length > 0) {
      // upload images to cloudinary
      let files = req?.files;
      console.log(files);
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

    const message = await ChatMessageModel.create({
      message: message_text,
      chat_id: chat?.id,
      sender_id,
      [fileUrl === "null" ? null : "file_attachments"]: fileUrl,
      [product_id === "null" ? null : product_id]: product_id,
      [service_id === "null" ? null : service_id]: service_id,
    });
    console.log(message);

    if (message) {
      responseHandle.successResponse(res, 201, "Message sent successfully.", {
        ...message._doc,
        sender_id: {
          _id: sender?._id,
          username: sender?.username,
          first_name: sender?.first_name,
          last_name: sender?.last_name,
          email: sender?.email,
          image: sender?.image,
        },
      });
    } else {
      res.status(500);
      throw new Error("could not send message");
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

export default chatMessages;
