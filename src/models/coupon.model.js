import mongoose from "mongoose";
import obj from "./plugins/index.js";

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  couponPrice: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  availableCount: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
});

// add plugin that converts mongoose to json
couponSchema.plugin(obj.toJSON);

// add apgination plugin
couponSchema.plugin(obj.paginate);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
