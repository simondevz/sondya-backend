import { Schema, model } from "mongoose";

const ModelSchema = Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    review_id: {
      type: Schema.Types.ObjectId,
      ref: "reviews",
    },
    response: {
      type: String,
    },
  },
  { timestamps: true }
);

const responseModel = model("response", ModelSchema);
export default responseModel;
