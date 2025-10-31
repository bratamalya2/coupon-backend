import mongoose from "mongoose";
import validator from "validator";
import obj from "./plugins/index.js";
import bcrypt from "bcrypt";
import ApiError from "../helpers/apiErrorConverter.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new ApiError("Invalid email", 400);
        }
      },
    },
    phone: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    profileimageurl: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: ["admin", "product-owner"],
      default: "product-owner",
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(obj.toJSON);

// add apgination plugin
userSchema.plugin(obj.paginate);

// check is user password is matching
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

// hash the user password before saving data to db
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// login user
userSchema.statics.loginUser = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError("Invalid email or password", 401);
  }

  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
