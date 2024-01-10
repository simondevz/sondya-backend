import { Schema, model } from "mongoose";

const notificationSchema = Schema(
  {
    user: {
      id: {
        type: String,
      },
      username: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    message: {
      type: String,
    },
    title: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String, // Representing order_sent, order_recieved, chat_message
    },
    link: {
      type: String,
    },
  },
  { timestamps: true }
);

const NotificationsModel = model("notifications", notificationSchema);
export default NotificationsModel;
