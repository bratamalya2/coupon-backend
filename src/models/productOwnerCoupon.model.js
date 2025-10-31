import mongoose from "mongoose";
import obj from "./plugins/index.js";

const productOwnerCouponSchema = new mongoose.Schema({
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// add plugin that converts mongoose to json
productOwnerCouponSchema.plugin(obj.toJSON);

// add apgination plugin
productOwnerCouponSchema.plugin(obj.paginate);

const ProductOwnerCoupon = mongoose.model(
  "ProductOwnerCoupon",
  productOwnerCouponSchema
);

export default ProductOwnerCoupon;
