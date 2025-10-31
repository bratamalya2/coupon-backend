import mongoose from "mongoose";
import obj from "./plugins/index.js";

const productOwnerInventorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quantityAvailable: {
    type: Number,
    required: true,
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
  },
});

// add plugin that converts mongoose to json
productOwnerInventorySchema.plugin(obj.toJSON);

// add apgination plugin
productOwnerInventorySchema.plugin(obj.paginate);

const productOwnerInventory = mongoose.model(
  "ProductOwnerInventory",
  productOwnerInventorySchema
);

export default productOwnerInventory;
