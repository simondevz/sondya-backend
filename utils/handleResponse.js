const responseHandle = {};

responseHandle.successResponse = (res, status, message, data) => {
  return res.status(Number(status)).json({
    message,
    data,
  });
};

module.exports = responseHandle;
