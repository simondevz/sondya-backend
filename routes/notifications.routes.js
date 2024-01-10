import express from "express";
import Notifications from "../controllers/notifications.controller.js";
const NotificationsRoutes = express.Router();

NotificationsRoutes.post("/notifications", Notifications.createNotifications);
NotificationsRoutes.put("/notifications/:id", Notifications.markSeen);
NotificationsRoutes.get(
  "/notifications/:user_id",
  Notifications.getNotifications
);
NotificationsRoutes.get(
  "/notifications/unseencount/:user_id",
  Notifications.getUnseenNotificationCount
);
NotificationsRoutes.delete(
  "/notifications/:id",
  Notifications.deleteNotifications
);

export default NotificationsRoutes;
