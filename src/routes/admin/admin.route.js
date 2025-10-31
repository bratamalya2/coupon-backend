import express from "express";
import validationSchema from "../../validators/admin.validator.js";
import validatorObj from "express-joi-validation";
import controller from "../../controllers/admin/admin.controller.js";
import isAdminMiddleware from "../../middlewares/isAdmin.middleware.js";

const validator = validatorObj.createValidator({
  passError: true,
});

const router = express.Router();

router.post(
  "/addItem",
  [validator.body(validationSchema.addItem), isAdminMiddleware()],
  controller.addItem
);

router.get("/getAllItems", [], controller.getAllItems);

router.put(
  "/modifyItem",
  [validator.body(validationSchema.modifyItem), isAdminMiddleware()],
  controller.modifyItem
);

router.delete(
  "/deleteItem",
  [validator.body(validationSchema.deleteItem), isAdminMiddleware()],
  controller.deleteItem
);

router.post("/createCoupon", [
  validator.body(validationSchema.createCoupon),
  isAdminMiddleware()
], controller.createCoupon);

router.put("/editCoupon", [
  validator.body(validationSchema.editCoupon),
  isAdminMiddleware()
], controller.editCoupon);

router.delete("/removeCoupon", [
  validator.body(validationSchema.removeCoupon),
  isAdminMiddleware()
], controller.removeCoupon)

export default router;
