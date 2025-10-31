import User from "../../models/user.model.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import ApiError from "../../helpers/apiErrorConverter.js";

const createUser = async (data) => {
  await User.create(data);
};

const loginUser = async (email, password) => {
  return await User.loginUser(email, password);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const changePassword = async (email, password) => {
  const pwd = await bcrypt.hash(password, 8);
  return await User.findOneAndUpdate({ email }, { password: pwd });
};

const getUserById = async (id) => {
  return await User.findById(new mongoose.Types.ObjectId(id));
};

const deleteAccountById = async (id) => {
  return await User.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
};

const updatePassword = async (user, newpass, oldpass) => {
  if (!(await bcrypt.compare(oldpass, user.password))) {
    throw new ApiError("Invalid Old Password", 400);
  }

  if (oldpass === newpass) {
    throw new ApiError("Old and New Password Can Not Be Same", 400);
  }

  return changePassword(user.email, newpass);
};

const updateUser = async (id, data) => {
  return await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, data, {
    returnDocument: "after",
  });
};

export default {
  createUser,
  loginUser,
  findUserByEmail,
  changePassword,
  getUserById,
  deleteAccountById,
  updatePassword,
  updateUser,
};
