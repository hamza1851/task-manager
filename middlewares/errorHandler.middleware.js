export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";
  console.log("The error occured: ", statusCode, message, err.name);

  if (err.name === "SequelizeValidationError") {
    // SequelizeValidationError is for validation errors like sending null for non-nullable fields
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors.map((e) => e.message)
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    // SequelizeUniqueConstraintError thrown when data sent for unique field already exists
    return res.status(400).json({
      message: "Duplicate entry",
      errors: err.errors.map((e) => e.message)
    });
  }

  if (err.name === "JsonWebTokenError") {
    // JsonWebTokenError for showing invalid token, malformed etc
    return res.status(401).json({ message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    // TokenExpiredError for expired token
    return res
      .status(401)
      .json({ message: "Token expired, please login again" });
  }

  // Fallback
  res.status(statusCode).json({
    success: false,
    message
  });
};
