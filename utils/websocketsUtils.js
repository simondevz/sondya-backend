import asyncHandler from "express-async-handler";
import GroupMessageModel from "../models/groupMessage.model.js";
import GroupChatModel from "../models/groupchat.model.js";
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

// wsUtil.userExistInRoom = (room_id, user_id) => {
//   let status = false;
//   const room = wsUtil.rooms[room_id];
//   for (let i = 0; i < room?.length; i++) {
//     let user = room[i];
//     for (const key in user) {
//       if (user_id === key) {
//         status = true;
//         break;
//       }
//     }
//   }
//   return status;
// };

wsUtil.userExistInRoom = (room_id, user_id) => {
  const room = wsUtil.rooms[room_id];
  if (!room) return false;

  for (let i = 0; i < room.length; i++) {
    let user = room[i];
    if (Object.prototype.hasOwnProperty.call(user, user_id)) {
      return true;
    }
  }
  return false;
};

wsUtil.createRoom = (data, ws) => {
  try {
    let { room_id, user_id, recipient_id, chat } = data;

    // Ensure user_id is a string
    user_id = String(user_id);

    wsUtil.rooms[room_id] = [];
    const user = {};
    user[user_id] = ws; // Add user_id as string key

    wsUtil.rooms[room_id].push(user);

    // Set user_id as a string in the WebSocket object
    ws["room_id"] = room_id;
    ws["user_id"] = user_id; // Ensure this is a string
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

wsUtil.echoPayload = (receiver_id, payload, ws) => {
  let { sender_id, chat_id } = payload;

  // Check if sender_id is an object (i.e., a map)
  if (typeof sender_id === "object" && sender_id !== null) {
    sender_id = sender_id._id; // Extract the actual sender_id from the object
  }

  // Ensure sender_id is a string
  sender_id = String(sender_id);

  // Add the person sending the message to the room
  const senderInRoom = wsUtil.userExistInRoom(chat_id, sender_id);

  if (!senderInRoom)
    wsUtil.joinRoom(
      {
        room_id: chat_id,
        user_id: sender_id,
        recipient_id: receiver_id,
      },
      ws
    );

  const room = wsUtil.rooms[chat_id];

  for (let i = 0; i < room.length; i++) {
    let user = room[i];

    for (let key in user) {
      let wsClient = user[key];
      wsClient.send(JSON.stringify(payload));
    }
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

    // Ensure user_id is a string
    user_id = String(user_id);

    // Check if the room exists or not
    const roomExist = wsUtil.roomExist(room_id);

    if (!roomExist) {
      return wsUtil.createRoom(data, ws);
    }

    const inRoom = wsUtil.userExistInRoom(room_id, user_id);

    if (inRoom) {
      return;
    } else {
      const user = {};
      user[user_id] = ws; // Add user_id as string key

      wsUtil.rooms[room_id].push(user);

      // Set user_id as a string in the WebSocket object
      ws["room_id"] = room_id;
      ws["user_id"] = user_id; // Ensure this is a string
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
