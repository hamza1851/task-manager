import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";

  if (err.name === "WrongRoute") {
    logger.error("Route does not exist: ", err.message);
    return res.status(404).json({
      message
    });
  }

  if (err.name === "SequelizeValidationError") {
    // SequelizeValidationError is for validation errors like sending null for non-nullable fields
    logger.error("Validation Error");
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors.map((e) => e.message)
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    // SequelizeUniqueConstraintError thrown when data sent for unique field already exists
    logger.error("Unique constraint violation");
    return res.status(400).json({
      message: "Duplicate entry",
      errors: err.errors.map((e) => e.message)
    });
  }

  if (err.name === "JsonWebTokenError") {
    // JsonWebTokenError for showing invalid token, malformed etc
    logger.error("Invalid token, authorization denied");
    return res.status(401).json({ message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    // TokenExpiredError for expired token
    logger.error("Token expired, please login again");
    return res
      .status(401)
      .json({ message: "Token expired, please login again" });
  }

  // Fallback
  logger.error("Oops error occured: ", err);
  res.status(statusCode).json({
    success: false,
    message
  });
};
