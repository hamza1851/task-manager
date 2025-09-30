import { getUserId } from "../services/getUserId.js";

export const authenticate = (req, res, next) => {
  // getUserId will return an object with userId, error, token and status
  const result = getUserId(req);

  if (result.error) {
    const err = new Error(result.error);
    err.statusCode = result.status;
    throw err;
    // return res.status(result.status).json({ message: result.error });
  }

  try {
    req.user = { id: result.userId };
    next();
  } catch (err) {
    next(err);
    // return res.status(403).json({ message: "Invalid or expired token" });
  }
};
