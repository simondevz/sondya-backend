import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Sodyna E-commerce website",
    description: "Description",
  },
  host: "localhost:8989",
};

const outputFile = "./swagger_output.json";
const routes = ["./server.mjs"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
