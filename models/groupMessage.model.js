import { Schema, model } from "mongoose";

const groupMessageSchema = Schema(
  {
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    group_id: {
      type: Schema.Types.ObjectId,
      ref: "groupChats",
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const GroupMessage = model("groupMessage", groupMessageSchema);
export default GroupMessage;
