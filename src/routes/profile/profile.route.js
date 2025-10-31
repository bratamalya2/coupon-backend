import express from "express";
import controller from "../../controllers/profile/profile.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import validationSchema from "../../validators/profile.validator.js";
import validatorObj from "express-joi-validation";
import upload from "../../middlewares/multer.middleware.js";

const validator = validatorObj.createValidator({
  passError: true,
});

const router = express.Router();

router.use(auth("user"));

router.delete("/delete-account", controller.deleteAccount);

router.patch(
  "/change-password",
  validator.body(validationSchema.passchange),
  controller.passwordChange
);

router.get("/profile-data", controller.getProfile);

router.patch(
  "/profile-update",
  upload.single("profileimageurl"),
  validator.body(validationSchema.profile),
  controller.updateProfile
);

export default router;
