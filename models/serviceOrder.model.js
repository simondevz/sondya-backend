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
      phone: {
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
      phone: {
        type: String,
      },
    },
    order_id: {
      type: String, // 6 digits
      unique: true,
    },
    payment_id: {
      type: String,
      unique: true,
    },
    payment_status: {
      type: String,
    },
    order_status: {
      type: String,
    },
    checkout_items: {
      _id: {
        type: String,
      },
      name: {
        type: String,
      },
      category: {
        type: String,
      },
      sub_category: {
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
      currency: {
        type: String,
      },
      old_price: {
        type: Number,
      },
      current_price: {
        type: Number,
      },
      percentage_price_off: {
        type: Number,
      },
      service_status: {
        type: String,
      },
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
      total_price: {
        type: Number,
      },
      delivery_time: {
        type: String,
      },
      terms: {
        amount: {
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
  },
  { timestamps: true }
);

const ServiceOrder = model("service_order", serviceOrderSchema);
export default ServiceOrder;
