import asyncHandler from "express-async-handler";
import NotificationsModel from "../models/notifications.model.js";
import UserModel from "../models/users.model.js";
import responseHandle from "../utils/handleResponse.js";
import wsUtil from "../utils/notificationWsUtils.js";

const Notifications = {};

Notifications.createNotifications = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Notifications']

  try {
    const notification = req.body;
    const check = await UserModel.findById(notification.user.id);
    if (!check) {
      res.status(400);
      throw new Error("User not found");
    }

    if (!notification.title) {
      res.status(400);
      throw new Error("No title in the notification");
    }

    if (!notification.message) {
      res.status(400);
      throw new Error("The notification needs a message");
    }

    if (!notification.type) {
      res.status(400);
      throw new Error("The notification needs a type");
    }

    if (!notification.link) {
      res.status(400);
      throw new Error("The notification needs a redirect link");
    }

    const notifications = await NotificationsModel.create(notification);

    if (!notifications) {
      res.status(500);
      throw new Error("could not retrieve notifications");
    }

    responseHandle.successResponse(
      res,
      201,
      "created notifications successfully.",
      notifications
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

Notifications.getNotifications = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Notifications']

  try {
    const user_id = req.params.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const notifications = await NotificationsModel.find({
      "user.id": user_id,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await NotificationsModel.countDocuments({
      "user.id": user_id,
    });

    if (!notifications) {
      res.status(500);
      throw new Error("could not retrieve notifications");
    }

    responseHandle.successResponse(
      res,
      200,
      "Retrieved notifications successfully.",
      { notifications, count }
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

Notifications.getUnseenNotificationCount = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Notifications']

  try {
    const user_id = req.params.user_id;

    const count = await NotificationsModel.countDocuments({
      "user.id": user_id,
      seen: false,
    });

    console.log(count);

    responseHandle.successResponse(
      res,
      200,
      "Retrieved notifications count successfully.",
      count
    );
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

Notifications.markSeen = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Notifications']

  try {
    const id = req.params.id;
    const updatedNotification = await NotificationsModel.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );

    if (!updatedNotification) {
      res.status(500);
      throw new Error("could not update notification");
    }

    responseHandle.successResponse(
      res,
      200,
      "Updated the notification successfully.",
      updatedNotification
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

Notifications.deleteNotifications = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Notifications']

  try {
    const id = req.params.id;
    const deleteNotification = await NotificationsModel.findByIdAndDelete(id);

    if (!deleteNotification) {
      res.status(500);
      throw new Error("could not delete notification");
    }

    responseHandle.successResponse(
      res,
      200,
      "Deleted notification successfully.",
      "Notification Deleted"
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export const wsNotificationController = {};

wsNotificationController.use = (path, app) =>
  app.ws(path, (ws) => {
    try {
      ws.on("message", (recieveData) => {
        let data = JSON.parse(recieveData);

        if (data.meta) {
          switch (data.meta) {
            case "echo_payload":
              wsUtil.echoPayload(
                data.sender_id,
                data.receiver_id,
                data.payload,
                ws
              );
              break;
            case "testing_connection":
              wsUtil.echoPayload(
                data.sender_id,
                data.receiver_id,
                data.payload,
                ws
              );
              break;

            default:
              wsUtil.joinRoom({ receiver_id: data.receiver_id }, ws);
              break;
          }
        }
      });

      ws.on("close", () => {
        wsUtil.leaveRoom({
          room_id: ws.user_id,
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
wsNotificationController.ping = (wss) =>
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
wsNotificationController.clearUnused = () =>
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

export default Notifications;
