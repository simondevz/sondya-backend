import { Schema, model } from "mongoose";

const ModelSchema = Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "products",
    },
    service_id: {
      type: Schema.Types.ObjectId,
      ref: "services",
    },
    responses: [
      {
        type: String,
        ref: "response",
      },
    ],
    review: {
      type: String,
    },
    rating: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Model = model("review", ModelSchema);
export default Model;
