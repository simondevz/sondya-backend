import wsUtil from "../../utils/websocketsUtils.js";

const wsChatController = {};

wsChatController.use = (path, app) =>
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
              break;

            case "join_conversations":
              wsUtil.joinRooms(data, ws);
              break;

            case "testing_connection":
              wsUtil.sendChatMessage(data, ws);
              break;

            case "testing_connections_inbox":
              for (const receiver_id of data.receiver_ids) {
                wsUtil.sendChatMessage(
                  { receiver_id, sender_id: data.sender_id, meta: data.meta },
                  ws
                );
              }
              break;

            default:
              wsUtil.joinRoom(
                { room_id: data.room_id, user_id: data.sender_id },
                ws
              );
              break;
          }
        } else {
          wsUtil.sendChatMessage(data, ws);
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

export default wsChatController;
