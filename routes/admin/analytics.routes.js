import express from "express";
import adminAnalytics from "../../controllers/admin/analytics.controller.js";
const AdminAnalyticsRoutes = express.Router();

AdminAnalyticsRoutes.get(
  "/admin/analytics/revenueandorder",
  adminAnalytics.revenueOrderAnalytics
);
AdminAnalyticsRoutes.get(
  "/admin/analytics/latestorders/services",
  adminAnalytics.latestServiceOrders
);
AdminAnalyticsRoutes.get(
  "/admin/analytics/latestorders/products",
  adminAnalytics.latestProductOrders
);
AdminAnalyticsRoutes.get(
  "/admin/analytics/topservices",
  adminAnalytics.topServices
);
AdminAnalyticsRoutes.get(
  "/admin/analytics/topproducts",
  adminAnalytics.topProducts
);

export default AdminAnalyticsRoutes;
