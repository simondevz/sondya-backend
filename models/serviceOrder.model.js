import { Schema, model } from "mongoose";

const serviceOrderSchema = Schema(
  {
    buyer: {
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
    seller: {
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
    service_id: {
      type: Schema.Types.ObjectId,
      ref: "services",
    },
    delivered: {
      type: Boolean,
    },
    terms: {
      amount: {
        type: Number,
      },
      advance: {
        type: Number,
      },
      duration: {
        type: Number,
      },
      durationUnit: {
        type: String,
      },
      acceptedByBuyer: {
        type: Boolean,
        default: false,
      },
      acceptedBySeller: {
        type: Boolean,
        default: false,
      },
      rejectedByBuyer: {
        type: Boolean,
        default: false,
      },
      rejectedBySeller: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const ServiceOrder = model("service_order", serviceOrderSchema);
export default ServiceOrder;
