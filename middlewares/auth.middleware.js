import { getUserId } from "../services/getUserId.js";

export const authenticate = (req, res, next) => {
  const result = getUserId(req);

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  try {
    req.user = { id: result.userId };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
