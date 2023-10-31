import { Schema, model } from "mongoose";

const productsSchema = Schema(
  {
    name: {
      type: String,
    },
    category: {
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

    // product status
    product_status: {
      type: String, // available | hot | sold |
    },
    hot_products: {
      type: Boolean,
    },

    // products ratings
    rating: {
      type: Number,
    },
    total_rating: {
      type: Number,
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
