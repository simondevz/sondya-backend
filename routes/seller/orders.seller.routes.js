import SellerOrder from "../../controllers/seller/orders.seller.controller.js";

import express from "express";
const SellerOrderRoutes = express.Router();

// for seller products order
SellerOrderRoutes.get(
  "/seller/order/products/:userId",
  SellerOrder.SellerGetProductsOrder
);
SellerOrderRoutes.get(
  "/seller/order/product/details/:id",
  SellerOrder.SellerGetProductOrderById
);
SellerOrderRoutes.delete(
  "/seller/order/products/:id",
  SellerOrder.SellerdeleteProductOrder
);

export default SellerOrderRoutes;
