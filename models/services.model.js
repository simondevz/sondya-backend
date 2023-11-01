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
    brief_description: {
      type: String,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    }, // body

    // prices
    old_price: {
      type: Number,
    }, // pricebefore
    current_price: {
      type: Number,
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

    // service status
    service_status: {
      type: String, // available | hot | sold |
    },

    // duration
    duration: {
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
