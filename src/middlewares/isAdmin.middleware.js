import ApiError from "../helpers/apiErrorConverter.js";
import tokenService from "../services/auth/token.service.js";
import authService from "../services/auth/auth.service.js";
import catchAsync from "../helpers/asyncErrorHandler.js";

export default function () {
  return catchAsync(async function (req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      throw new ApiError("Please authenticate", 401);
    }
    // access, refresh -> authorization
    const access = token.split(" ")[1];
    const data = await tokenService.verifyToken(access, "access");

    const user = await authService.getUserById(data.sub);

    if (!user) {
      throw new ApiError("Invalid User", 401);
    }

    if(user.role !== "admin")
      throw new ApiError("Invalid User", 403);

    next();
  });
}
