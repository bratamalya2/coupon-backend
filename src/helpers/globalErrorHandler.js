import config from "../config/config.js";
import ApiError from "../helpers/apiErrorConverter.js";

const handleDevErrors = (res, error) => {
  return res.status(error.statusCode).send({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const handleProdErrors = (res, error) => {
  if (error.isOperational) {
    return res.status(error.statusCode).send({
      status: error.status,
      message: error.message,
    });
  } else {
    return res
      .status(500)
      .send({ status: "error", message: "Something went wrong" });
  }
};

const CaseErrorHandler = (err) => {
  return new ApiError(`Invalid Value ${err.value} For Field ${err.path}`, 400);
};

const DuplicateKeyError = (err) => {
  const keys = Object.keys(err.keyValue);
  if (keys.length > 0) {
    const firstKey = keys[0];
    const firstKeysValue = err.keyValue[firstKey];
    return new ApiError(
      `The Entry ${firstKeysValue} already exists in database`,
      400
    );
  }
};

const ValidationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMsg = errors.join(". ");
  const msg = `Invalid input data ${errorMsg}`;
  return new ApiError(msg, 400);
};

const HandleJoiError = (err) => {
  const errMsgs = err.error.details.map((item) =>
    item.message.replace(/['"]/g, "")
  );
  return new ApiError(errMsgs[0], 400);
};

const JsonWebTokenErrorHandler = (error) => {
  return new ApiError(error.message, 401);
};

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (config.env === "dev") {
    handleDevErrors(res, error);
  }

  if (config.env === "prod") {
    if (error.name === "CastError") error = CaseErrorHandler(error);
    if (error.code === 11000) error = DuplicateKeyError(error);
    if (error.name === "ValidationError") error = ValidationErrorHandler(error);
    if (error.type && error.type === "body") error = HandleJoiError(error);
    if (error.name === "JsonWebTokenError")
      error = JsonWebTokenErrorHandler(error);
    if (error.name === "TokenExpiredError")
      error = JsonWebTokenErrorHandler(error);
    handleProdErrors(res, error);
  }
};

export default globalErrorHandler;
