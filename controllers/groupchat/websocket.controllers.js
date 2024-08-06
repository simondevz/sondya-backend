import wsUtil from "../../utils/websocketsUtils.js";

const wsGroupChatController = {};

wsGroupChatController.use = (path, app) =>
  app.ws(path, (ws) => {
    try {
      ws.on("message", (recieveData) => {
        let data = JSON.parse(recieveData);
        const error = wsUtil.paramsExist(data);
        if (!error) {
          throw new Error("check data params");
        }

        if (data.meta) {
          switch (data.meta) {
            case "get_online_users":
              wsUtil.getOnlineUsers(data, ws);
              break;
            case "join_conversation":
              wsUtil.joinRoom(data, ws);
              break;
            case "echo_payload":
              wsUtil.echoPayload(data.receiver_id, data.payload, ws);
              break;
            default:
              wsUtil.joinRoom(data, ws);
              break;
          }
        } else {
          wsUtil.sendMessage(data, ws);
        }
      });

      ws.on("close", () => {
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
wsGroupChatController.ping = (wss) =>
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
wsGroupChatController.clearUnused = () =>
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

export default wsGroupChatController;
