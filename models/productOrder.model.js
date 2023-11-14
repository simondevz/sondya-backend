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
    },
  },
  { timestamps: true }
);

const ProductOrder = model("product_order", productOrderSchema);
export default ProductOrder;
