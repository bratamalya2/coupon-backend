import ApiError from "../../helpers/apiErrorConverter.js";
import Otp from "../../models/otp.model.js";
import crypto from "crypto";
import email from "../email/email.service.js";
import config from "../../config/config.js";

function generateSecureOTP() {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }

  return otp;
}

const generateOtp = async (user) => {
  const otp = await Otp.create({ otp: generateSecureOTP(), email: user.email });
  if (!otp) {
    throw new ApiError("Error In OTP generations", 500);
  }
  await email.sendSendgridEmail(
    user.email,
    user.username,
    "Password Reset OTP",
    `Your OTP for email verification is ${otp.otp}`,
    "d-8e092450a85a4e158288342590812cf9"
  );
};

const verifyOtp = async (email, otp) => {
  const otpindb = await Otp.findOne({ email, otp });

  if (!otpindb) {
    throw new ApiError("Invalid Otp", 400);
  }

  const createdAt = otpindb.createdAt;
  const currentTime = new Date();

  const timeDifferenceInMilliseconds = currentTime - createdAt;
  const timeDifferenceInMinutes = timeDifferenceInMilliseconds / (1000 * 60);

  if (
    timeDifferenceInMinutes > Number(config.jwt.resetPasswordExpirationMinutes)
  ) {
    throw new ApiError("Otp expired", 400);
  }

  otpindb.is_verify = true;
  otpindb.save();
  return;
};

const getOtpIfVerified = async (email, otp) => {
  const otpindb = await Otp.findOne({ email, otp, is_verify: true });

  if (!otpindb) {
    throw new ApiError("Unverified Or Invalid Otp", 400);
  }

  return Otp.deleteOne({ _id: otpindb._id });
};

export default {
  generateOtp,
  verifyOtp,
  getOtpIfVerified,
};
