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
    checkoutItems: [
      {
        _id: {
          type: String,
        },
        name: {
          type: String,
        },
        category: {
          type: String,
        },
        description: {
          type: String,
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
        quantity: {
          type: Number,
        },
        product_id: {
          type: String,
        },
        Order_quantity: {
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
      },
    ],
    subTotal: {
      type: Number,
    },
    shippingFee: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    currency: {
      type: String,
    },
    ShippingDestination: {
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
    paymentMethod: {
      type: String,
    },
    paymentStatus: {
      type: String,
    },
    Category: {
      type: String,
    },
    orderStatus: {
      type: String,
    },
    callback_url: {
      type: String,
    },
  },
  { timestamps: true }
);

const ProductOrder = model("product_order", productOrderSchema);
export default ProductOrder;
