import GroupMessageModel from "../models/groupMessage.model.js";
import ChatMessageModel from "../models/chatMessage.model.js";
import GroupChatModel from "../models/groupchat.model.js";
import ChatModel from "../models/chat.model.js";
import asyncHandler from "express-async-handler";
import UserModel from "../models/users.model.js";
import handleUpload from "./upload.js";

const wsUtil = {};

wsUtil.heartbeat = (ws) => {
  ws["isAlive"] = true;
};

wsUtil.rooms = {};

wsUtil.paramsExist = (data) => {
  try {
    if (
      "room_id" in data &&
      ("user_id" in data || "sender_id" in data) &&
      "message" in data
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

wsUtil.roomExist = (room_id) => {
  // check for room is already exist or not
  if (room_id in wsUtil.rooms) {
    return true;
  } else {
    return false;
  }
};

wsUtil.userExistInRoom = (room_id, user_id) => {
  let status = false;
  const room = wsUtil.rooms[room_id];
  for (let i = 0; i < room.length; i++) {
    let user = room[i];
    for (const key in user) {
      if (user_id === key) {
        status = true;
        break;
      }
    }
  }
  return status;
};

// create room
wsUtil.createRoom = (data, ws) => {
  try {
    let { room_id, user_id, recipient_id, chat } = data;

    wsUtil.rooms[room_id] = [];
    const user = {};
    user[user_id] = ws;

    wsUtil.rooms[room_id].push(user);
    ws["room_id"] = room_id;
    ws["user_id"] = user_id;
    if (recipient_id) ws["recipient_id"] = recipient_id;
    if (chat) ws["chat"] = chat;

    return ws;
  } catch (error) {
    throw new Error("ws error: Could not create room");
  }
};

// get list of people in room
wsUtil.getOnlineUsers = (data, ws) => {
  try {
    if (!data?.room_id) throw new Error("no room id passed");
    const room = wsUtil.rooms[data?.room_id];
    const online = room?.map((user) => Object.keys(user)[0]);

    ws.send(
      JSON.stringify({
        meta: "users_online",
        online,
      })
    );
  } catch (error) {
    console.log(error);
    throw new Error(error?.message || "ws error: Could not get users in room");
  }
};

// Check if a user got a message in a room he is not in yet
wsUtil.newRoomCheck = (data, ws) => {
  try {
    const { user_id } = data;
    let newChats = [];

    for (const room_id in wsUtil.rooms) {
      const room = wsUtil.rooms[room_id];

      if (room[0]?.recipient_id === user_id && room?.length === 1) {
        newChats = [...newChats, room[0].chat];
      }
    }

    ws.send(
      JSON.stringify({
        meta: "new_room",
        chats: newChats,
      })
    );
  } catch (error) {
    console.log(error);
    throw new Error("ws error: Could not find new rooms");
  }
};

// join room
wsUtil.joinRoom = (data, ws) => {
  try {
    let { room_id, user_id, recipient_id, chat } = data;
    // check if room exist or not

    const roomExist = wsUtil.roomExist(room_id);

    if (!roomExist) {
      return wsUtil.createRoom(data, ws);
    }

    const inRoom = wsUtil.userExistInRoom(room_id, user_id);

    if (inRoom) {
      return;
    } else {
      const user = {};
      user[user_id] = ws;
      wsUtil.rooms[room_id].push(user);

      ws["room_id"] = room_id;
      ws["user_id"] = user_id;
      if (recipient_id) ws["recipient_id"] = recipient_id;
      if (chat) ws["chat"] = chat;

      return ws;
    }
  } catch (error) {
    throw new Error("ws error: Could not join room");
  }
};

// join multiple rooms
wsUtil.joinRooms = (data, ws) => {
  try {
    let { room_ids, user_id } = data;
    room_ids?.map((room_id) => wsUtil.joinRoom({ room_id, user_id }, ws));
  } catch (error) {
    console.log(error);
    throw new Error("ws error: Could not join some rooms");
  }
};

// send message
wsUtil.sendMessage = asyncHandler(async (data, ws) => {
  const { room_id, message, images, user_id } = data;
  try {
    const check = await GroupChatModel.findById(room_id);
    if (!check) {
      throw new Error("Id not found");
    }

    const userFromDb = await UserModel.findById(user_id);
    if (!userFromDb) {
      throw new Error("User not found");
    }

    if (!message && !images.length) {
      throw new Error("No message");
    }

    let imageUrl = [];
    if (images?.length > 0) {
      imageUrl = await wsUtil.handleUpload(images);
    }

    let groupMessage = await GroupMessageModel.create({
      group_id: room_id,
      message,
      sender_id: user_id,
      image: imageUrl,
    });

    if (!groupMessage) {
      throw new Error("could not send message");
    }

    wsUtil.joinRoom(data, ws);
    const room = wsUtil.rooms[room_id];
    for (let i = 0; i < room.length; i++) {
      let user = room[i];
      for (let key in user) {
        let wsClient = user[key];
        wsClient.send(
          JSON.stringify({
            ...groupMessage._doc,
            sender: userFromDb,
            likes: [],
          })
        );
      }
    }
  } catch (error) {
    console.log(error);
    ws.send(
      JSON.stringify({
        meta: "error_occured",
        error: error.message,
      })
    );
  }
});

// send message
wsUtil.sendChatMessage = asyncHandler(async (data, ws) => {
  const {
    message,
    file_attachments,
    sender_id,
    receiver_id,
    product_id,
    service_id,
    meta,
  } = data;
  try {
    const sender = await UserModel.findById(sender_id).lean();
    if (!sender?._id) {
      throw new Error(
        "The ID of the person sending this message was not found"
      );
    }

    const receiver = await UserModel.findById(receiver_id).lean();
    if (!receiver?._id) {
      throw new Error(
        "The ID of the person recieving this message was not found"
      );
    }

    let chat = await ChatModel.findOne({
      $or: [
        { user1: sender_id, user2: receiver_id },
        { user1: receiver_id, user2: sender_id },
      ],
    })
      .populate("user1", ["username", "first_name", "last_name", "email"])
      .populate("user2", ["username", "first_name", "last_name", "email"]);

    if (!chat) {
      chat = await ChatModel.create({
        user1: sender_id,
        user2: receiver_id,
      });
    }

    wsUtil.joinRoom(
      {
        room_id: chat?._id,
        user_id: sender_id,
        recipient_id: receiver_id,
        chat,
        fromChatMessage: true,
      },
      ws
    );
    const room = wsUtil.rooms[chat?._id];

    if (
      !(meta === "testing_connection" || meta === "testing_connections_inbox")
    ) {
      if (!message && !file_attachments?.length) {
        throw new Error("No message");
      }

      let file_attachmentsUrls = [];
      if (file_attachments?.length > 0) {
        file_attachmentsUrls = await wsUtil.handleUpload(file_attachments);
      }

      let chatMessage = await ChatMessageModel.create({
        chat_id: chat?._id,
        message,
        sender_id: sender_id,
        file_attachments: file_attachmentsUrls,
        product_id,
        service_id,
      });

      if (!chatMessage) {
        throw new Error("could not send message");
      }

      for (let i = 0; i < room.length; i++) {
        let user = room[i];
        for (let key in user) {
          let wsClient = user[key];
          wsClient.send(
            JSON.stringify({
              ...chatMessage._doc,
              sender_id: {
                _id: sender?._id,
                username: sender?.username,
                first_name: sender?.first_name,
                last_name: sender?.last_name,
                email: sender?.email,
                image: sender?.image,
              },
            })
          );
        }
      }
    } else {
      for (let i = 0; i < room.length; i++) {
        let user = room[i];
        for (let key in user) {
          let wsClient = user[key];

          wsClient.send(
            JSON.stringify({
              meta: "connection_tested",
              message: "say, hi",
            })
          );
        }
      }
    }
  } catch (error) {
    console.log(error);
    console.log("running.....");
    ws.send(
      JSON.stringify({
        meta: "error_occured",
        error: error.message,
      })
    );
  }
});

// image upload
wsUtil.handleUpload = async (file_attachments) => {
  try {
    // upload file_attachments to cloudinary
    let multiplePicturePromise = file_attachments.map(
      async (file_attachment, index) => {
        const cldRes = await handleUpload(file_attachment.fileContent, index);
        return cldRes;
      }
    );

    // get url of uploaded file_attachments
    const file_attachmentsResponse = await Promise.all(multiplePicturePromise);
    const file_attachmentsUrl = file_attachmentsResponse.map(
      (file_attachment) => {
        console.log(file_attachment);
        const url = file_attachment.secure_url;
        const public_id = file_attachment.public_id;
        const folder = file_attachment.folder;
        const format = file_attachment.format;
        return { url, public_id, folder, format };
      }
    );
    // end of uploaded file_attachments

    return file_attachmentsUrl;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

wsUtil.leaveRoom = (data) => {
  try {
    const { room_id, user_id } = data;
    const roomExist = wsUtil.roomExist(room_id);
    if (!roomExist) return;

    // find the index of user
    const room = wsUtil.rooms[room_id];
    let index = null;
    for (let i = 0; i < room.length; i++) {
      let user = room[i];
      for (let key in user) {
        if (key === user_id) {
          index = i;
        }
      }
    }
    if (index != null) {
      // remove the user using the index
      wsUtil.rooms[room_id].splice(index, 1);
    }
  } catch (error) {
    throw new Error("ws error: could not leave room");
  }
};

export default wsUtil;
