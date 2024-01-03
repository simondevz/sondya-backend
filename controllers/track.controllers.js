import asyncHandler from "express-async-handler";
// import ContactUsModel from "../models/contactus.model.js";
import { EstimatedDeliveryDate, RoundUpTime } from "../utils/calctime.js";
import DistanceMatrix from "../utils/distance.js";
import responseHandle from "../utils/handleResponse.js";

const TrackDistanceTime = {};

TrackDistanceTime.track = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Track Distance']

  const data2 = req.body;
  console.log(data2);

  try {
    const responseArrayData = [];

    // Fetching coordinates for origin and destination
    if (data2 && data2.length > 0) {
      const responsePromise = data2.map(async (item) => {
        const originDes = `${item?.origin?.city ?? ""} ${
          item?.origin?.state ?? ""
        }, ${item?.origin?.country ?? ""}`;

        const destinationDes = `${item?.destination?.city ?? ""} ${
          item?.destination?.state ?? ""
        }, ${item?.destination?.country ?? ""}`;

        // Fetching coordinates for origin and destination
        const [originCoords, destinationCoords] = await Promise.all([
          DistanceMatrix.getCoordinates(originDes),
          DistanceMatrix.getCoordinates(destinationDes),
        ]);

        // Calculating distance using the Haversine formula
        const distance = await DistanceMatrix.calculateDistance(
          originCoords.lat,
          originCoords.lng,
          destinationCoords.lat,
          destinationCoords.lng
        );

        // Round up the distance
        const roundedDistance = distance.toFixed(2);

        // Calculating estimated delivery time
        const estimatedTimeShipping = RoundUpTime(distance / 8);
        const estimatedTimeFlight = RoundUpTime(distance / 80);

        // Calculating estimated delivery date
        const estimatedDeliveryDateShipping = EstimatedDeliveryDate(
          distance / 8,
          10
        );
        const estimatedDeliveryDateFlight = EstimatedDeliveryDate(
          distance / 80,
          3
        );

        const responseData = {
          _id: item._id,
          originCoordinates: originCoords,
          destinationCoordinates: destinationCoords,
          distance: roundedDistance,
          timeShipping: estimatedTimeShipping,
          timeFlight: estimatedTimeFlight,
          deliveryDateShipping: estimatedDeliveryDateShipping,
          deliveryDateFlight: estimatedDeliveryDateFlight,
        };

        return responseData;
      });

      // Wait for all promises to resolve using Promise.all
      const resolvedData = await Promise.all(responsePromise);

      responseArrayData.push(...resolvedData);
    }

    // Send response
    responseHandle.successResponse(
      res,
      201,
      "shipping variables calculated successfully.",
      responseArrayData
    );
  } catch (error) {
    res.status(500);
    console.log("error ==> ", error);
    throw new Error(error);
  }
});

export default TrackDistanceTime;
