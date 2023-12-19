import { Schema, model } from "mongoose";

const chatMessageSchema = Schema(
  {
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    chat_id: {
      type: Schema.Types.ObjectId,
      ref: "chats",
    },
    message: {
      type: String,
    },
    product_id: {
      type: String,
    },
    service_id: {
      type: String,
    },
    file_attachments: [
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
        format: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const ChatMessage = model("chatMessage", chatMessageSchema);
export default ChatMessage;
