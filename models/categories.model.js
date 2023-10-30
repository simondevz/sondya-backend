import { Schema, model } from "mongoose";

const categoriesSchema = Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    }, // body
  },
  { timestamps: true }
);

const Category = model("categories", categoriesSchema);
export default Category;
