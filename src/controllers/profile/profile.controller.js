import catchAsync from "../../helpers/asyncErrorHandler.js";
import service from "../../services/auth/auth.service.js";

const deleteAccount = catchAsync(async (req, res, next) => {
  await service.deleteAccountById(req.user._id);
  res.status(200).send({ message: "Account Deleted" });
});

const passwordChange = catchAsync(async (req, res, next) => {
  await service.updatePassword(
    req.user,
    req.body.password_new,
    req.body.password_old
  );
  res.status(200).send({ message: "Password Updated" });
});

const getProfile = catchAsync(async (req, res, next) => {
  res.status(200).send({ message: "Profile Data", user: req.user });
});

const updateProfile = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.profileimageurl = req.file.location;
  }
  const user = await service.updateUser(req.user._id, req.body);
  res.status(200).send({ message: "Profile Data", user: user });
});

export default {
  deleteAccount,
  passwordChange,
  getProfile,
  updateProfile,
};
