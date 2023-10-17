import dotenv from "dotenv";
dotenv.config();

const errorMiddleware = {};

errorMiddleware.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl} is invalid`);
  res.status(404);
  next(error);
};

errorMiddleware.errorHandler = (err, req, res, next) => {
  const statusCode = res.statuscode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    code: statusCode,
    message: err.message,
    // eslint-disable-next-line no-undef
    env: process.env.NODE_ENV,
    // eslint-disable-next-line no-undef
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
  next();
};

export default errorMiddleware;
