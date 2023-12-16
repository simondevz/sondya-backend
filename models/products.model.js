import { Schema, model } from "mongoose";

const productsSchema = Schema(
  {
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
    }, // body
    total_stock: { type: Number },
    tag: {
      type: String,
    },
    brand: {
      type: String,
    },
    model: {
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
    old_price: {
      type: Number,
      default: 0,
    }, // pricebefore
    current_price: {
      type: Number,
    }, // price now
    discount_percentage: {
      type: Number,
    },
    vat_percentage: {
      type: Number,
    },

    // product status
    product_status: {
      type: String, // available | hot | sold | draft
    },
    hot_products: {
      type: Boolean,
    },

    // products ratings
    rating: {
      type: Number,
      default: 0,
    },
    total_rating: {
      type: Number,
      default: 0,
    },

    // variants
    total_variants: {
      type: Number,
    },
    variants: [
      {
        name: {
          type: String,
        },
      },
    ],

    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    zip_code: {
      type: String,
    },
    address: {
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
  },
  { timestamps: true }
);

const Product = model("products", productsSchema);
export default Product;
