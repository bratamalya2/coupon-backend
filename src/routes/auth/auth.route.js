import express from "express";
import validationSchema from "../../validators/auth.validator.js";
import validatorObj from "express-joi-validation";
import controller from "../../controllers/auth/auth.controller.js";

const validator = validatorObj.createValidator({
  passError: true,
});

const router = express.Router();

router.post(
  "/register",
  validator.body(validationSchema.register),
  controller.register
);

router.post("/login", validator.body(validationSchema.login), controller.login);

router.post(
  "/logout",
  validator.body(validationSchema.logout),
  controller.logout
);

router.post(
  "/refresh-tokens",
  validator.body(validationSchema.tokens),
  controller.refreshTokens
);

router.post(
  "/forgot-password",
  validator.body(validationSchema.forgot),
  controller.forgotPassword
);

router.post(
  "/verify-otp",
  validator.body(validationSchema.verify),
  controller.verify
);

router.patch(
  "/reset-password",
  validator.body(validationSchema.reset),
  controller.reset
);

export default router;
