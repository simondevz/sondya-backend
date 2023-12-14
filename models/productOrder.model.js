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
    },
    order_id: {
      type: String, // 6 digits
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
  },
  { timestamps: true }
);

const ProductOrder = model("product_order", productOrderSchema);
export default ProductOrder;
