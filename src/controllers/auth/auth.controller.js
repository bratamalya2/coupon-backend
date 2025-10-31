import service from "../../services/auth/auth.service.js";
import token from "../../services/auth/token.service.js";
import otp from "../../services/auth/otp.service.js";
import catchAsync from "../../helpers/asyncErrorHandler.js";
import ApiError from "../../helpers/apiErrorConverter.js";

const register = catchAsync(async (req, res, next) => {
  const x = await service.findUserByEmail(req.body.email);
  if (x) {
    res.status(403).send({ message: "User already exists" });
  } else {
    await service.createUser(req.body);
    res.status(201).send({ message: "User has been created" });
  }
});

const login = catchAsync(async (req, res, next) => {
  const user = await service.loginUser(req.body.email, req.body.password);
  const tokens = token.generateAuthTokens(user);
  res.status(200).send({ message: "Login Success", tokens, user });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await service.findUserByEmail(req.body.email);

  if (!user) {
    throw new ApiError("User Not Found", 404);
  }

  await otp.generateOtp(user);

  res.status(200).send({ message: "Otp Sent on the email address" });
});

const verify = catchAsync(async (req, res, next) => {
  const user = await service.findUserByEmail(req.body.email);

  if (!user) {
    throw new ApiError("User Not Found", 404);
  }

  await otp.verifyOtp(user.email, req.body.otp);

  res.status(200).send({ message: "Otp verified successfully" });
});

const reset = catchAsync(async (req, res, next) => {
  const user = await service.findUserByEmail(req.body.email);

  if (!user) {
    throw new ApiError("User Not Found", 404);
  }

  await otp.getOtpIfVerified(user.email, req.body.otp);

  await service.changePassword(user.email, req.body.password);

  res.status(200).send({ message: "Password reset Successfull" });
});

const refreshTokens = catchAsync(async (req, res, next) => {
  const data = await token.verifyToken(req.body.token, "refresh");
  const user = await service.getUserById(data.sub);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const tokens = token.generateAuthTokens(user);

  await token.blacklistToken(req.body.token, "refresh");

  res.status(200).send({ message: "Token refresh succesfull", tokens });
});

const logout = catchAsync(async (req, res, next) => {
  await token.blacklistToken(req.body.access, "access");
  await token.blacklistToken(req.body.refresh, "refresh");
  res.status(200).send({ message: "Logout successfull" });
});

export default {
  register,
  login,
  forgotPassword,
  verify,
  reset,
  refreshTokens,
  logout,
};
