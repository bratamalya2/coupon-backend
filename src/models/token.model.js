import mongoose from "mongoose";
import obj from "./plugins/index.js";

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["access", "refresh"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.plugin(obj.toJSON);

const Token = mongoose.model("Token", tokenSchema);

export default Token;
