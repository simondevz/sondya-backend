import dotenv from "dotenv";
dotenv.config();

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl} is invalid`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res) => {
  const statusCode = res.statuscode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // eslint-disable-next-line no-undef
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
