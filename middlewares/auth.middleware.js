import { getUserId } from "../utils/getUserId.js";
import logger from "../utils/logger.js";

export const authenticate = (req, res, next) => {
  // getUserId will return an object with userId, error, token and status
  const result = getUserId(req);

  if (result.error) {
    logger.error("Authentication error: ", result.error)
    const err = new Error(result.error);
    err.statusCode = result.status;
    throw err;
  }

  try {
    req.user = { id: result.userId };
    next();
  } catch (err) {
    next(err);
  }
};
