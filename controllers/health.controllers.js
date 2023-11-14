import asyncHandler from "express-async-handler";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import responseHandle from "../utils/handleResponse.js";

const config = load(readFileSync("config.yaml", "utf8"));
const health = {};

health.Get = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Health']
  if (!config) {
    res.status(400);
    throw new Error("getting yaml file error");
  }
  var healthtest = {
    yaml: config.test.check,
    get: "Get: Hello World!",
    status: true,
  };
  responseHandle.successResponse(
    res,
    201,
    "health test successful.",
    healthtest
  );
});

health.Post = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Health']
  res.send("Post: Hello World!");
});

export default health;
