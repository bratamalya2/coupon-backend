import express from "express";

// import auth router
import authRouter from "./auth/auth.route.js";

// import profile router
import profileRouter from "./profile/profile.route.js";

//import admin router
import adminRouter from "./admin/admin.route.js";

//import product router
import productRouter from "./product-owner/product-owner.route.js";

//import payment router
import paymentRouter from "./payment/payment.route.js";

const router = express.Router();

// all routes
router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/admin", adminRouter);
router.use("/product-owner", productRouter);
router.use("/payment", paymentRouter);

export default router;
