import { Schema, model } from "mongoose";

const productOrderSchema = Schema(
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
    batch_id: {
      type: String, // 6 digits
      unique: true,
    },
    order_id: {
      type: String, // 6 digits
      unique: true,
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
      total_stock: {
        type: Number,
      },
      tag: {
        type: String,
      },
      brand: {
        type: String,
      },
      model: {
        type: String,
      },
      current_price: {
        type: Number,
      },
      product_status: {
        type: String,
      },
      old_price: {
        type: Number,
      },
      discount_percentage: {
        type: Number,
      },
      vat_percentage: {
        type: Number,
      },
      total_variants: {
        type: Number,
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
      //location
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
      // track
      track_distance_time: {
        _id: {
          type: String,
        },
        originCoordinates: {
          lat: {
            type: Number,
          },
          lng: {
            type: Number,
          },
        },
        destinationCoordinates: {
          lat: {
            type: Number,
          },
          lng: {
            type: Number,
          },
        },
        distance: {
          type: Number,
        },
        timeShipping: {
          type: String,
        },
        timeFlight: {
          type: String,
        },
        deliveryDateShipping: {
          type: String,
        },
        deliveryDateFlight: {
          type: String,
        },
      },
    },
    shipping_destination: {
      _id: {
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
      address: {
        type: String,
      },
      zipcode: {
        type: String,
      },
      phone_number: {
        type: String,
      },
    },
    total_amount: {
      type: Number,
    },
    payment_id: {
      type: String,
    },
    payment_status: {
      type: String,
    },
    order_status: {
      type: String,
    },
    order_location: [
      {
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
        order_status: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const ProductOrder = model("product_order", productOrderSchema);
export default ProductOrder;
