import mongoose from "mongoose";
import obj from "./plugins/index.js";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      trim: true,
      required: true,
    },
    productPrice: {
        type: Number,
        required: true
    },
    productDescription: {
      type: String,
      trim: true,
      required: true
    },
    productImageURL: {
      type: String,
      trim: true,
      default: ""
    }
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(obj.toJSON);

// add apgination plugin
productSchema.plugin(obj.paginate);


const Product = mongoose.model("Product", productSchema);

export default Product;
