import { Schema, model } from "mongoose";

const servicesSchema = Schema(
  {
    name: {
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

    // owner
    owner: {
      id: {
        type: String,
      },
      username: {
        type: String,
      },
      email: {
        type: String,
      },
      country: {
        type: String,
      },
    },

    // prices
    currency: {
      type: String,
    }, // pricebefore
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
      type: String, // available | draft | suspended | closed
    },

    // duration
    duration: {
      type: String,
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

    // service location
    location_description: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    phone_number_backup: {
      type: String,
    },
    email: {
      type: String,
    },
    website_link: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    map_location_link: {
      type: String,
    },
  },
  { timestamps: true }
);

const Service = model("services", servicesSchema);
export default Service;
