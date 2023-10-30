import { Schema, model } from "mongoose";

const servicesSchema = Schema(
  {
    name: {
      type: String,
    },
    user: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    }, // body

    // prices
    old_price: {
      type: String,
    }, // pricebefore
    current_price: {
      type: String,
    }, // price now
    percentage_price_off: {
      type: String,
    },

    // products ratings
    rating: {
      type: Number,
    },
    total_rating: {
      type: Number,
    },

    // images
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

const Service = model("services", servicesSchema);
export default Service;
