import express from "express";
import validationSchema from "../../validators/product-owner.validator.js";
import validatorObj from "express-joi-validation";
import controller from "../../controllers/product-owner/product-owner.controller.js";
//import isAdminMiddleware from "../../middlewares/isAdmin.middleware.js";
import AuthMiddleware from "../../middlewares/auth.middleware.js";

const validator = validatorObj.createValidator({
  passError: true,
});

const router = express.Router();

router.get(
  "/getAllCoupons",
  AuthMiddleware("product-owner"),
  controller.getAllCoupons
);

router.get(
  "/getInventoryStatus",
  AuthMiddleware("product-owner"),
  controller.getInventoryStatus
);

router.get(
  "/getAllCartItems",
  AuthMiddleware("product-owner"),
  controller.getAllCartItems
);

router.post(
  "/addCouponToCart",
  [
    validator.body(validationSchema.addCouponToCart),
    AuthMiddleware("product-owner"),
  ],
  controller.addCouponToCart
);

router.put(
  "/modifyCouponQuantityInCart",
  [
    validator.body(validationSchema.modifyCouponQuantityInCart),
    AuthMiddleware("product-owner"),
  ],
  controller.modifyCouponQuantityInCart
);

router.delete(
  "/deleteCouponFromCart",
  [
    validator.body(validationSchema.deleteCouponFromCart),
    AuthMiddleware("product-owner"),
  ],
  controller.deleteCouponFromCart
);

export default router;
