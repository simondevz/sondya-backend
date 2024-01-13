import asyncHandler from "express-async-handler";
import ProductOrderModel from "../../models/productOrder.model.js";
import ServiceOrderModel from "../../models/serviceOrder.model.js";
import responseHandle from "../../utils/handleResponse.js";
import { limitTwelveMonths, monthlySelect } from "../../utils/selectMonth.js";

const SellerAnalysis = {};

SellerAnalysis.getDataAnalysis = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Seller analytics']

  try {
    let productOrderTotal = 0;
    let serviceOrderTotal = 0;
    let AvgProductOrderTotal = 0;
    let AvgServiceOrderTotal = 0;

    // get product orders
    const ProductOrder = await ProductOrderModel.find({
      "checkout_items.owner.id": req.params.id,
      createdAt: limitTwelveMonths,
    });
    if (!ProductOrder) {
      res.status(404);
      throw new Error("Id not found");
    }

    // get service orders
    const ServiceOrder = await ServiceOrderModel.find({
      "checkout_items.owner.id": req.params.id,
      createdAt: limitTwelveMonths,
    });
    if (!ServiceOrder) {
      res.status(404);
      throw new Error("Id not found");
    }

    // calculate total product orders
    ProductOrder.forEach((order) => {
      productOrderTotal += order.checkout_items.sub_total;
    });

    // calculate total service orders
    ServiceOrder.forEach((order) => {
      serviceOrderTotal += order.checkout_items.terms.amount;
    });

    // calculate average product orders
    if (productOrderTotal > 0 && ProductOrder.length > 0) {
      AvgProductOrderTotal = productOrderTotal / ProductOrder.length;
    }

    // calculate average service orders
    if (serviceOrderTotal > 0 && ServiceOrder.length > 0) {
      AvgServiceOrderTotal = serviceOrderTotal / ServiceOrder.length;
    }

    // start grouping data monthly for product order
    const aggregationPipelineProduct = [
      {
        $match: {
          "checkout_items.owner.id": req.params.id,
          createdAt: limitTwelveMonths,
        },
      },
      {
        $group: {
          _id: {
            // month: { $month: "$createdAt" }, // Assuming createdAt is the timestamp of the order
            month: monthlySelect,
            year: { $year: "$createdAt" },
          },
          totalAmount: { $sum: "$checkout_items.sub_total" }, // Assuming 'amount' is the property representing the order amount
          totalCount: { $sum: 1 }, // Counting the number of orders for each month
        },
      },
      {
        $addFields: {
          averageAmount: { $divide: ["$totalAmount", "$totalCount"] },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ];

    const productOrderMonthlyTotals = await ProductOrderModel.aggregate(
      aggregationPipelineProduct
    );

    if (!productOrderMonthlyTotals) {
      res.status(404);
      throw new Error("could not process product order monthly totals");
    }
    // end of monthly grouping for product orders

    // start grouping data monthly for service order
    const aggregationPipelineService = [
      {
        $match: {
          "checkout_items.owner.id": req.params.id,
          createdAt: limitTwelveMonths,
        },
      },
      {
        $group: {
          _id: {
            // month: { $month: "$createdAt" }, // Assuming createdAt is the timestamp of the order
            month: monthlySelect,
            year: { $year: "$createdAt" },
          },
          totalAmount: { $sum: "$checkout_items.terms.amount" },
          totalCount: { $sum: 1 }, // Counting the number of orders for each month
        },
      },
      {
        $addFields: {
          averageAmount: { $divide: ["$totalAmount", "$totalCount"] },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ];

    const serviceOrderMonthlyTotals = await ServiceOrderModel.aggregate(
      aggregationPipelineService
    );

    if (!serviceOrderMonthlyTotals) {
      res.status(404);
      throw new Error("could not process service order monthly totals");
    }
    // end of monthly grouping for product orders

    // count total items sold
    const countSoldItem = await ProductOrderModel.find({
      "checkout_items.owner.id": req.params.id,
      createdAt: limitTwelveMonths,
    });

    let OverallTotalSold = 0;
    let OverallTotalSoldAmount = 0;

    // calculate total product orders
    countSoldItem.forEach((order) => {
      OverallTotalSold += order.checkout_items.order_quantity;
      OverallTotalSoldAmount += order.checkout_items.sub_total;
    });

    if (!countSoldItem) {
      res.status(404);
      throw new Error("could not count sold items");
    }

    const aggregationPipelineMostSoldItem = [
      {
        $match: {
          "checkout_items.owner.id": req.params.id,
          createdAt: limitTwelveMonths,
        },
      },
      {
        $group: {
          _id: {
            id: "$checkout_items._id",
            name: "$checkout_items.name",
          },
          totalAmount: { $sum: "$checkout_items.sub_total" }, // Assuming 'price' is the property representing the product price
          totalCount: { $sum: "$checkout_items.order_quantity" }, // Counting the number of orders for each product name
        },
      },
      {
        $addFields: {
          percentageCount: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$totalCount", OverallTotalSold] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
      {
        $sort: {
          totalAmount: -1, // Sort by totalAmount in descending order
        },
      },
      {
        $limit: 4, // Limit to the top 5 items
      },
    ];

    const MostSoldItemList = await ProductOrderModel.aggregate(
      aggregationPipelineMostSoldItem
    );

    if (!MostSoldItemList) {
      res.status(404);
      throw new Error("could not calc most sold item");
    }

    // calculate for other items if it exist
    // count total items sold
    const countSoldItem2 = await ProductOrderModel.countDocuments({
      "checkout_items.owner.id": req.params.id,
      createdAt: limitTwelveMonths,
    });

    if (!countSoldItem2) {
      res.status(404);
      throw new Error("could not calc most sold item");
    }

    // console.log(countSoldItem2);

    if (countSoldItem2 > 4) {
      // MostSoldItemList;

      let OverallTotalSoldLimited = 0;
      let OverallTotalSoldLimitedAmount = 0;
      // calculate total product orders
      MostSoldItemList.forEach((order) => {
        OverallTotalSoldLimited += order.totalCount;
        OverallTotalSoldLimitedAmount += order.totalAmount;
      });

      const remainingCount = OverallTotalSold - OverallTotalSoldLimited;
      const remainingAmount =
        OverallTotalSoldAmount - OverallTotalSoldLimitedAmount;

      const remainingPercentageCount =
        (remainingCount / OverallTotalSold) * 100;

      MostSoldItemList.push({
        _id: {
          id: "others",
          name: "other products",
        },
        totalAmount: remainingAmount,
        totalCount: remainingCount,
        percentageCount: Math.round(remainingPercentageCount),
      });
    }
    // calculate for extra item ends

    const data = {
      total_product_sales_amount: productOrderTotal,
      total_service_sales_amount: serviceOrderTotal,
      avg_total_product_sales_amount: Math.ceil(AvgProductOrderTotal),
      avg_total_service_sales_amount: Math.ceil(AvgServiceOrderTotal),
      product_monthly_order_group: productOrderMonthlyTotals,
      service_monthly_order_group: serviceOrderMonthlyTotals,
      most_sold_items: MostSoldItemList,
    };

    responseHandle.successResponse(
      res,
      200,
      "analysis calculated successfully.",
      data
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default SellerAnalysis;
