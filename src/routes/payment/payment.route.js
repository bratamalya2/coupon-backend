import express from "express";
import validationSchema from "../../validators/payment.validator.js";
import validatorObj from "express-joi-validation";
import controller from "../../controllers/payment/payment.controller.js";
//import isAdminMiddleware from "../../middlewares/isAdmin.middleware.js";
import AuthMiddleware from "../../middlewares/auth.middleware.js";

const validator = validatorObj.createValidator({
  passError: true,
});

const router = express.Router();

router.post(
  "/checkout",
  [
    validator.body(validationSchema.checkout),
    AuthMiddleware("product-owner"),
  ],
  controller.checkout
);

router.get(
  "/success",
  [],
  controller.success
);

export default router;
