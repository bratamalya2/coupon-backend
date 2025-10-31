import mongoose from "mongoose";
import obj from "./plugins/index.js";

const cartSchema = new mongoose.Schema({
  quantityAvailable: {
    type: Number,
    required: true,
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

// add plugin that converts mongoose to json
cartSchema.plugin(obj.toJSON);

// add apgination plugin
cartSchema.plugin(obj.paginate);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
