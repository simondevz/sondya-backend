import { Schema, model } from "mongoose";

const groupChatSchema = Schema(
  {
    // The admin that created the group chat
    admin_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "active", // "active" or "suspended"
    },
    // Groups logo
    image: [
      {
        url: {
          type: String,
        },
        public_id: {
          type: String,
        },
        folder: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const GroupChat = model("groupChats", groupChatSchema);
export default GroupChat;
