import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/config.js";
import logger from "./logger.js";

// This function extracts and verifies the JWT token from the request headers
export const getUserId = (req) => {
  const result = {
    userId: "",
    error: "",
    token: null,
    status: null
  };

  const authHeader = req.headers["authorization"]; // get the authorization header
  if (!authHeader) {
    logger.error("Authorization header missing");
    result.status = 401;
    result.error = "Authorization header missing";
    return result;
  }

  const token = authHeader.split(" ")[1]; // extract the token from "Bearer <token>"
  if (!token) {
    logger.error("Token missing in authHeader");
    result.status = 401;
    result.error = "Token missing";
    return result;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    result.userId = decoded.id;
    result.status = 200;
    result.token = token;
    return result;
  } catch (error) {
    logger.error("Invalid or expired token");
    result.status = 403;
    result.error = "Invalid or expired token";
    return result;
  }
};
