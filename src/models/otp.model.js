import mongoose from "mongoose";
import validator from "validator";
import obj from "./plugins/index.js";
import ApiError from "../helpers/apiErrorConverter.js";

const otpSchema = mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new ApiError("Invalid Email address", 400);
        }
      },
    },
    is_verify: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.plugin(obj.toJSON);

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
