import wsUtil from "../../utils/websocketsUtils.js";

const wsChatController = {};

wsChatController.activeUsers = new Map();

wsChatController.use = (path, app) =>
  app.ws(path, (ws) => {
    try {
      ws.on("message", (recieveData) => {
        let data = JSON.parse(recieveData);

        if (data.meta) {
          switch (data.meta) {
            case "Test_echo_terms":
              wsUtil.echoPayload(data.receiver_id, data.payload, ws);
              break;
            case "echo_terms":
              wsUtil.echoPayload(data.receiver_id, data.payload, ws);
              break;
            case "echo_payload":
              wsUtil.echoPayload(data.receiver_id, data.payload, ws);
              break;
            case "user_online_check":
              wsUtil.getOnlineUsers(data, ws);
              break;

            case "new_room_check":
              wsUtil.newRoomCheck(data, ws);
              break;

            case "join_conversation":
              wsUtil.joinRoom(
                { room_id: data.room_id, user_id: data.sender_id },
                ws
              );
              // eslint-disable-next-line no-case-declarations
              const user_id = data.sender_id;
              wsChatController.activeUsers.set(user_id, ws);
              wsChatController.broadcastStatus(user_id, "online", ws);
              break;

            case "join_review_terms_room":
              wsUtil.joinRoom(
                { room_id: data.room_id, user_id: data.sender_id },
                ws
              );
              break;

            case "join_conversations": {
              wsUtil.joinRooms(data, ws);
              break;
            }
            // wsUtil.joinRooms(data, ws);
            // break;

            case "testing_connection":
              wsUtil.echoPayload(data.receiver_id, data.payload, ws);
              break;
            default:
              wsUtil.joinRoom(
                { room_id: data.room_id, user_id: data.sender_id },
                ws
              );
              break;
          }
        }
      });

      ws.on("close", () => {
        const { user_id } = ws;
        wsChatController.activeUsers.delete(user_id);
        wsChatController.broadcastStatus(user_id, "offline");
        wsUtil.leaveRoom({
          room_id: ws.room_id,
          user_id: ws.user_id,
        });
        ws.terminate();
      });

      ws.on("pong", wsUtil.heartbeat);
    } catch (error) {
      console.log(error);
    }
  });

// ping to check if user is stil online
wsChatController.ping = (wss) =>
  setInterval(() => {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) {
        wsUtil.leaveRoom({ room_id: ws.room_id, user_id: ws.user_id });
        ws.terminate();
      }
      ws.isAlive = false;
      ws.ping(() => {});
    });
  }, 600000); // 10 minutes interval

// Interval searches for empty rooms to remove
wsChatController.clearUnused = () =>
  setInterval(() => {
    var removeKey = [];
    for (const room_id in wsUtil.rooms) {
      if (wsUtil.rooms[room_id].length < 1) {
        removeKey.push(room_id);
      }
    }
    for (let i = 0; i < removeKey.length; i++) {
      delete wsUtil.rooms[removeKey[i]];
    }
  }, 50000);

// Function to broadcast user status
wsChatController.broadcastStatus = (user_id, status) => {
  wsChatController.activeUsers.forEach((ws) => {
    // if (id !== user_id) {
    // Don't send the status update to the user themselves
    ws.send(
      JSON.stringify({
        meta: "user_status",
        user_id,
        status,
      })
    );
    // }
  });
};

export default wsChatController;
