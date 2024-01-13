export const monthlySelect = {
  $switch: {
    branches: [
      { case: { $eq: [{ $month: "$createdAt" }, 1] }, then: "January" },
      { case: { $eq: [{ $month: "$createdAt" }, 2] }, then: "February" },
      { case: { $eq: [{ $month: "$createdAt" }, 3] }, then: "March" },
      { case: { $eq: [{ $month: "$createdAt" }, 4] }, then: "April" },
      { case: { $eq: [{ $month: "$createdAt" }, 5] }, then: "May" },
      { case: { $eq: [{ $month: "$createdAt" }, 6] }, then: "June" },
      { case: { $eq: [{ $month: "$createdAt" }, 7] }, then: "July" },
      { case: { $eq: [{ $month: "$createdAt" }, 8] }, then: "August" },
      { case: { $eq: [{ $month: "$createdAt" }, 9] }, then: "September" },
      { case: { $eq: [{ $month: "$createdAt" }, 10] }, then: "October" },
      { case: { $eq: [{ $month: "$createdAt" }, 11] }, then: "November" },
      { case: { $eq: [{ $month: "$createdAt" }, 12] }, then: "December" },
    ],
    default: "Unknown",
  },
};

export const limitTwelveMonths = {
  $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)), // Start date, 12 months ago
  $lte: new Date(), // End date, today
};
