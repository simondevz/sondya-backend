import { Schema, model } from "mongoose";

const ChatSchema = Schema(
  {
    user1: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    user2: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Chat = model("chats", ChatSchema);
export default Chat;
