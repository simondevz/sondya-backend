import { Schema, model } from "mongoose";

const productOrderPaymentSchema = Schema(
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
    },
    checkout_items: [
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
        Order_quantity: {
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
      },
    ],
    payment_method: {
      type: String,
    },
    payment_status: {
      type: String,
    },
    payment_id: {
      type: String,
    },
    total_amount: {
      type: Number,
    },
    currency: {
      type: String,
    },
    callback_url: {
      type: String,
    },
  },
  { timestamps: true }
);

const ProductOrderPayment = model(
  "product_order_payment",
  productOrderPaymentSchema
);
export default ProductOrderPayment;
