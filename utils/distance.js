/* eslint-disable no-undef */
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const DistanceMatrix = {};

DistanceMatrix.getCoordinates = async (location) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location
    )}&key=${process.env.GOOGLE_API_KEY}`
  );

  const { lat, lng } = response.data.results[0].geometry.location;
  return { lat, lng };
};

DistanceMatrix.calculateDistance = async (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers

  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers
  return distance;
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export default DistanceMatrix;
