import { Schema, model } from "mongoose";

const categoriesSchema = Schema(
  {
    category: {
      type: String, // "Service" or "Product"
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    }, // body
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

const Category = model("categories", categoriesSchema);
export default Category;
