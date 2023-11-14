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
  },
  { timestamps: true }
);

const ServiceOrder = model("service_order", serviceOrderSchema);
export default ServiceOrder;
