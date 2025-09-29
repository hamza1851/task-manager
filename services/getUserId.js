import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "e6e4ba6325c11b5a98a600b0d588fea9";

export const getUserId = (req) => {
  const result = {
    userId: "",
    error: "",
    token: null,
    status: null
  };
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    result.status = 401;
    result.error = "Authorization header missing";
    return result;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
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
    result.status = 403;
    result.error = "Invalid or expired token";
    return result;
  }
};
