export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";
  console.log("The error occured: ", statusCode, message, err.name);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors.map((e) => e.message)
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      message: "Duplicate entry",
      errors: err.errors.map((e) => e.message)
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
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
