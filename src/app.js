import express from "express";
import helmet from "helmet";
import compression from "compression";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import morgan from "./config/morgan.js";
import appRouter from "./routes/index.js";
import config from "./config/config.js";
import { authLimiter, otpLimiter } from "./helpers/authLimiter.js";
import globalErrorHandler from "./helpers/globalErrorHandler.js";
import ApiError from "./helpers/apiErrorConverter.js";
import swaggerUi from "swagger-ui-express";
import specs from "../swagger.js"; // Path to your swagger.js file

// initialize express app
const app = express();

// log requests to console
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// only content type application/json allowed
app.use(express.json({ limit: "20mb" }));

// set security headers automatically
app.use(helmet());

// gzip compress response
app.use(compression());

// clean income request for any unwanted codes
app.use(xss());
app.use(mongoSanitize());

// enable cors
app.use(
  cors({
    origin: ["*"], // allowing all origins
  })
);

// auth limiter in production mode
if (config.env === "prod") {
  app.use("/v1/auth/", authLimiter);
  app.use("/v1/auth/forgot-password", otpLimiter);
}

// api docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// all routes
app.use("/v1", appRouter);

// 404 error
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on the server!`, 404));
});

// handle all errors
app.use(globalErrorHandler);

export default app;
