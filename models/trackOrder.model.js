import { Schema, model } from "mongoose";

const trackOrderSchema = Schema(
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
    current_location: {
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
      address: {
        type: String,
      },
      zip_code: {
        type: String,
      },
    },
    origin: {
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
      address: {
        type: String,
      },
      zip_code: {
        type: String,
      },
    },
    destination: {
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
      address: {
        type: String,
      },
      zip_code: {
        type: String,
      },
    },
    checkout_items: {
      _id: {
        type: String,
      },
      name: {
        type: String,
      },
      order_quantity: {
        type: Number,
      },
      sub_total: {
        type: Number,
      },
      shipping_fee: {
        type: Number,
      },
      tax: {
        type: Number,
      },
      discount: {
        type: Number,
      },
      total_price: {
        type: Number,
      },
    },
    tracking_id: {
      type: String,
    },
    order_status: {
      type: String,
    },
    delivery_date: {
      type: Date,
    },
  },
  { timestamps: true }
);

const TrackOrder = model("track_order", trackOrderSchema);
export default TrackOrder;
