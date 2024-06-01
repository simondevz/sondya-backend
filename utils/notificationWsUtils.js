const wsUtil = {};

wsUtil.heartbeat = (ws) => {
  ws["isAlive"] = true;
};

wsUtil.rooms = {};

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
  for (let i = 0; i < room?.length; i++) {
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
    let { receiver_id } = data;
    const user_id = receiver_id;

    wsUtil.rooms[user_id] = [];
    const user = {};
    user[user_id] = ws;

    wsUtil.rooms[user_id].push(user);
    ws["user_id"] = user_id;
    return ws;
  } catch (error) {
    throw new Error("ws error: Could not create room");
  }
};

wsUtil.echoPayload = (sender_id, receiver_id, payload, ws) => {
  const room = wsUtil.rooms[receiver_id];
  console.log("hy1");
  console.log(room);
  wsUtil.joinRoom({ receiver_id: sender_id }, ws);
  if (room)
    if (room[0][receiver_id]) {
      console.log(payload);
      room[0][receiver_id].send(JSON.stringify(payload));
    }
};

// join room
wsUtil.joinRoom = (data, ws) => {
  try {
    let { receiver_id } = data;
    const user_id = receiver_id;
    // check if room exist or not
    const roomExist = wsUtil.roomExist(user_id);
    if (!roomExist) {
      return wsUtil.createRoom(data, ws);
    }

    const inRoom = wsUtil.userExistInRoom(user_id, user_id);
    if (inRoom) {
      return;
    } else {
      const user = {};
      user[user_id] = ws;
      wsUtil.rooms[user_id].push(user);

      ws["user_id"] = user_id;
      return ws;
    }
  } catch (error) {
    throw new Error("ws error: Could not join room");
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
