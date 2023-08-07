const asyncHandler = require("express-async-handler");
const { successResponse } = require("../utils/handleResponse");
const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("config.yaml", "utf8"));
const health = {};

health.Get = asyncHandler(async (req, res) => {
  if (!config) {
    res.status(400);
    throw new Error("getting yaml file error");
  }
  healthtest = {
    yaml: config.test.check,
    get: "Get: Hello World!",
    status: true,
  };
  successResponse(res, 201, "health test successful.", healthtest);
});

health.Post = asyncHandler(async (req, res) => {
  res.send("Post: Hello World!");
});

module.exports = health;
