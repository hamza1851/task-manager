import logger from "../utils/logger.js";

const rateLimitMap = new Map();

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const LIMIT = 60 * 1000; // 1 minute
  const MAX_REQUESTS = 10; // max requests per minute

  // Get user's request timestamps or empty array
  let userLog = rateLimitMap.get(ip) ?? [];

  // Keep only requests within the time window
  userLog = userLog.filter((timestamp) => now - timestamp < LIMIT);

  if (userLog.length >= MAX_REQUESTS) {
    logger.warn("Rate limit exceeded for IP: ", ip)
    return res.status(429).json({
      error: "Too many requests, please try again in 1 minute."
    });
  }

  // Add current request timestamp
  userLog.push(now);
  rateLimitMap.set(ip, userLog);

  next();
};

export default rateLimiter;
