import asyncHandler from "express-async-handler";
import responseHandle from "../../utils/handleResponse.js";
import ProductOrderModel from "../../models/productOrder.model.js";
import ServiceOrderModel from "../../models/serviceOrder.model.js";
import ProductModel from "../../models/products.model.js";
import ServiceModel from "../../models/services.model.js";
// import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { format, sub } from "date-fns";

const adminAnalytics = {};

adminAnalytics.topProducts = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Analytics']
  const currentDate = new Date();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  try {
    const productOrders = await ProductOrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$checkout_items._id",
          count: { $sum: "$checkout_items.order_quantity" },
        },
      },
    ]);

    await Promise.all(
      productOrders
        .sort(
          (productOrder1, productOrder2) =>
            productOrder2.count - productOrder1.count
        )
        .map(async (productOrder, index) => {
          if (index < 8) {
            const product = await ProductModel.findById(productOrder._id);
            productOrder.product = product;
            return productOrder;
          }
        })
    );

    if (!productOrders) {
      res.status(500);
      throw new Error("Could not retrieve products");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Products gotten successfully.",
        productOrders.slice(0, 8)
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

adminAnalytics.topServices = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Analytics']
  const currentDate = new Date();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  try {
    const serviceOrders = await ServiceOrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$checkout_items._id",
          count: { $sum: 1 },
        },
      },
    ]);

    await Promise.all(
      serviceOrders
        .sort(
          (serviceOrder1, serviceOrder2) =>
            serviceOrder2.count - serviceOrder1.count
        )
        .map(async (serviceOrder, index) => {
          if (index < 8) {
            const service = await ServiceModel.findById(serviceOrder._id);
            serviceOrder.service = service;
          }
        })
    );

    if (!serviceOrders) {
      res.status(500);
      throw new Error("Could not retrieve services");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Services gotten successfully.",
        serviceOrders.slice(0, 8)
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

adminAnalytics.latestProductOrders = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Analytics']

  try {
    const productOrders = await ProductOrderModel.find()
      .sort({ createdAt: -1 })
      .limit(10);

    if (!productOrders) {
      res.status(500);
      throw new Error("Could not retrieve products");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Products gotten successfully.",
        productOrders
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

adminAnalytics.latestServiceOrders = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Analytics']

  try {
    const serviceOrders = await ServiceOrderModel.find()
      .sort({ createdAt: -1 })
      .limit(10);

    if (!serviceOrders) {
      res.status(500);
      throw new Error("Could not retrieve services");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Services gotten successfully.",
        serviceOrders
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

adminAnalytics.revenueOrderAnalytics = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Analytics']
  const endDate = new Date();
  const startDate = sub(endDate, { months: 6 });

  try {
    // get service orders
    const serviceOrders = await ServiceOrderModel.find({
      createdAt: { $gte: startDate, $lt: endDate },
    });
    if (!serviceOrders) {
      res.status(500);
      throw new Error("Could not retrieve service orders");
    }

    // get product orders
    const productOrders = await ProductOrderModel.find({
      createdAt: { $gte: startDate, $lt: endDate },
    });
    if (!productOrders) {
      res.status(500);
      throw new Error("Could not retrieve product orders");
    }

    const returnedAnalytics = {
      revenueAnalytics: {
        totalRevenue: 0,
        graphData: new Array(6).fill(0),
        graphDates: new Array(6),
      },
      ordersAnalytics: {
        totalOrders: 0,
        graphData: new Array(6).fill(0),
        graphDates: new Array(6),
      },
    };

    // Calculate total orders
    returnedAnalytics.ordersAnalytics.totalOrders =
      serviceOrders.length + productOrders.length;

    //   total revenue
    serviceOrders.map((order) => {
      if (order.payment_status === "COMPLETED")
        returnedAnalytics.revenueAnalytics.totalRevenue +=
          order.checkout_items.terms.amount;
    });

    productOrders.map((order) => {
      if (order.payment_status === "COMPLETED")
        returnedAnalytics.revenueAnalytics.totalRevenue += order.total_amount;
    });

    // graph data - total for each of the sixmonths
    const oneMonthAgo = sub(endDate, { months: 1 });
    returnedAnalytics.revenueAnalytics.graphDates[5] = format(
      endDate,
      "do MMMM"
    );
    returnedAnalytics.ordersAnalytics.graphDates[5] = format(
      endDate,
      "do MMMM"
    );

    const twoMonthAgo = sub(endDate, { months: 2 });
    returnedAnalytics.revenueAnalytics.graphDates[4] = format(
      oneMonthAgo,
      "do MMMM"
    );
    returnedAnalytics.ordersAnalytics.graphDates[4] = format(
      oneMonthAgo,
      "do MMMM"
    );

    const threeMonthAgo = sub(endDate, { months: 3 });
    returnedAnalytics.revenueAnalytics.graphDates[3] = format(
      twoMonthAgo,
      "do MMMM"
    );
    returnedAnalytics.ordersAnalytics.graphDates[3] = format(
      twoMonthAgo,
      "do MMMM"
    );

    const fourMonthAgo = sub(endDate, { months: 4 });
    returnedAnalytics.revenueAnalytics.graphDates[2] = format(
      threeMonthAgo,
      "do MMMM"
    );
    returnedAnalytics.ordersAnalytics.graphDates[2] = format(
      threeMonthAgo,
      "do MMMM"
    );

    const fiveMonthAgo = sub(endDate, { months: 5 });
    returnedAnalytics.revenueAnalytics.graphDates[1] = format(
      fourMonthAgo,
      "do MMMM"
    );
    returnedAnalytics.ordersAnalytics.graphDates[1] = format(
      fourMonthAgo,
      "do MMMM"
    );

    const sixMonthAgo = startDate;
    returnedAnalytics.revenueAnalytics.graphDates[0] = format(
      fiveMonthAgo,
      "do MMMM"
    );
    returnedAnalytics.ordersAnalytics.graphDates[0] = format(
      fiveMonthAgo,
      "do MMMM"
    );

    serviceOrders.map((order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate.getTime() >= oneMonthAgo.getTime()) {
        if (order.payment_status === "COMPLETED") {
          returnedAnalytics.revenueAnalytics.graphData[5] +=
            order.checkout_items.terms.amount;
        }
        returnedAnalytics.ordersAnalytics.graphData[5] += 1;
      }

      if (
        orderDate.getTime() >= twoMonthAgo.getTime() &&
        orderDate.getTime() < oneMonthAgo.getTime()
      ) {
        if (order.payment_status === "COMPLETED") {
          returnedAnalytics.revenueAnalytics.graphData[4] +=
            order.checkout_items.terms.amount;
        }
        returnedAnalytics.ordersAnalytics.graphData[4] += 1;
      }

      if (
        orderDate.getTime() >= threeMonthAgo.getTime() &&
        orderDate.getTime() < twoMonthAgo.getTime()
      ) {
        if (order.payment_status === "COMPLETED") {
          returnedAnalytics.revenueAnalytics.graphData[3] +=
            order.checkout_items.terms.amount;
        }
        returnedAnalytics.ordersAnalytics.graphData[3] += 1;
      }

      if (
        orderDate.getTime() >= fourMonthAgo.getTime() &&
        orderDate.getTime() < threeMonthAgo.getTime()
      ) {
        if (order.payment_status === "COMPLETED") {
          returnedAnalytics.revenueAnalytics.graphData[2] +=
            order.checkout_items.terms.amount;
        }
        returnedAnalytics.ordersAnalytics.graphData[2] += 1;
      }

      if (
        orderDate.getTime() >= fiveMonthAgo.getTime() &&
        orderDate.getTime() < fourMonthAgo.getTime()
      ) {
        if (order.payment_status === "COMPLETED") {
          returnedAnalytics.revenueAnalytics.graphData[1] +=
            order.checkout_items.terms.amount;
        }
        returnedAnalytics.ordersAnalytics.graphData[1] += 1;
      }

      if (
        orderDate.getTime() >= sixMonthAgo.getTime() &&
        orderDate.getTime() < fiveMonthAgo.getTime()
      ) {
        if (order.payment_status === "COMPLETED") {
          returnedAnalytics.revenueAnalytics.graphData[0] +=
            order.checkout_items.terms.amount;
        }
        returnedAnalytics.ordersAnalytics.graphData[0] += 1;
      }
    });

    productOrders.map((order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate.getTime() >= oneMonthAgo.getTime()) {
        if (order.payment_status === "COMPLETED") {
          returnedAnalytics.revenueAnalytics.graphData[5] += order.total_amount;
        }
        returnedAnalytics.ordersAnalytics.graphData[5] += 1;
      }

      if (
        orderDate.getTime() >= twoMonthAgo.getTime() &&
        orderDate.getTime() < oneMonthAgo.getTime()
      ) {
        if (order.payment_status === "COMPLETED") {
          returnedAnalytics.revenueAnalytics.graphData[4] += order.total_amount;
        }
        returnedAnalytics.ordersAnalytics.graphData[4] += 1;
      }

      if (
        orderDate.getTime() >= threeMonthAgo.getTime() &&
        orderDate.getTime() < twoMonthAgo.getTime()
      ) {
        if (order.payment_status === "COMPLETED") {
          returnedAnalytics.revenueAnalytics.graphData[3] += order.total_amount;
        }
        returnedAnalytics.ordersAnalytics.graphData[3] += 1;
      }

      if (
        orderDate.getTime() >= fourMonthAgo.getTime() &&
        orderDate.getTime() < threeMonthAgo.getTime()
      ) {
        if (order.payment_status === "COMPLETED") {
          returnedAnalytics.revenueAnalytics.graphData[2] += order.total_amount;
        }
        returnedAnalytics.ordersAnalytics.graphData[2] += 1;
      }

      if (
        orderDate.getTime() >= fiveMonthAgo.getTime() &&
        orderDate.getTime() < fourMonthAgo.getTime()
      ) {
        if (order.payment_status === "COMPLETED") {
          returnedAnalytics.revenueAnalytics.graphData[1] += order.total_amount;
        }
        returnedAnalytics.ordersAnalytics.graphData[1] += 1;
      }

      if (
        orderDate.getTime() >= sixMonthAgo.getTime() &&
        orderDate.getTime() < fiveMonthAgo.getTime()
      ) {
        if (order.payment_status === "COMPLETED") {
          returnedAnalytics.revenueAnalytics.graphData[0] += order.total_amount;
        }
        returnedAnalytics.ordersAnalytics.graphData[0] += 1;
      }
    });

    console.log(returnedAnalytics);
    responseHandle.successResponse(
      res,
      200,
      "Data gotten successfully.",
      returnedAnalytics
    );
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

// adminAnalytics.visitorsAndConversions = asyncHandler(async (req, res) => {
//   // #swagger.tags = ['Admin Analytics']

//   try {
//     const propertyId = "422952567";
//     const analyticsDataClient = new BetaAnalyticsDataClient();
//     const [response] = await analyticsDataClient.runReport({
//       property: `properties/${propertyId}`,
//       dateRanges: [
//         {
//           startDate: "2020-03-31",
//           endDate: "today",
//         },
//       ],
//       // dimensions: [
//       //   {
//       //     name: "city",
//       //   },
//       // ],
//       metrics: [
//         {
//           name: "purchaseRevenue",
//         },
//       ],
//     });

//     console.log(response);
//   } catch (error) {
//     res.status(500);
//     console.log(error);
//     throw new Error(error);
//   }
// });

export default adminAnalytics;
