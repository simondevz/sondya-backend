import { Schema, model } from "mongoose";

const likesSchema = Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    message_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Likes = model("likes", likesSchema);
export default Likes;
