import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
});

const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 1, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
  message: "Wait 1 minute before requesting another otp",
  statusCode: 400,
});

export {
  authLimiter,
  otpLimiter
}
