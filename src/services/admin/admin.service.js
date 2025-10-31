import Product from "../../models/product.model.js";
import Coupon from "../../models/coupon.model.js";
import ProductOwnerCoupon from "../../models/productOwnerCoupon.model.js";
import User from "../../models/user.model.js";

const createProduct = async (data) => {
  await Product.create(data);
};

const getAllProducts = async (data) => {
  return await Product.find({});
};

const findProductById = async (id) => {
  return await Product.findById(id);
};

const modifyProduct = async (id, product) => {
  return await Product.findByIdAndUpdate(id, { ...product });
};

const removeProduct = async (id) => {
  await Product.findByIdAndRemove(id);
};

const createCoupon = async (data) => {
  const product = await Product.findById(data.productId);

  await Coupon.create({
    product,
    couponCode: data.couponCode,
    couponPrice: data.couponPrice,
    discountPercentage: data.discountPercentage,
    availableCount: data.availableCount,
  });
};

const findExistingCoupon = async (couponCode) => {
  return await Coupon.findOne({
    couponCode,
  });
};

const editExistingCoupon = async (data) => {
  const coupon = await Coupon.findOne({
    couponCode: data.couponCode,
  });

  const product = await Product.findById(data.productId);

  await Coupon.findByIdAndUpdate(coupon["_id"], {
    couponCode: data.couponCode,
    couponPrice: data.couponPrice ? data.couponPrice : coupon.couponPrice,
    discountPercentage: data.discountPercentage
      ? data.discountPercentage
      : coupon.discountPercentage,
    availableCount: data.availableCount
      ? data.availableCount
      : coupon.availableCount,
    product,
  });
};

const deleteCoupon = async (couponCode) => {
  await Coupon.findOneAndDelete({
    couponCode,
  });
};

const getUserFromId = async (userId) => {
  return await User.findById(userId);
};

const getProductOwnerWithCoupon = async (couponCode) => {
  const coupon = await Coupon.findOne({
    couponCode,
  });
  return await ProductOwnerCoupon.findOne({
    coupon,
  });
};

const addProductOwnerWithCoupon = async (userId, couponCode) => {
  const user = await User.findById(userId);
  const coupon = await Coupon.findOne({
    couponCode,
  });
  await ProductOwnerCoupon.create({
    user,
    coupon,
  });
};

const editProductOwnerWithCoupon = async (userId, couponCode) => {
  const user = await User.findById(userId);
  const coupon = await Coupon.findOne({
    couponCode,
  });
  await ProductOwnerCoupon.findOneAndUpdate(
    {
      coupon,
    },
    {
      user,
    }
  );
};

const removeProductOwnerWithCoupon = async (couponCode) => {
  const coupon = await Coupon.findOne({
    couponCode,
  });
  await ProductOwnerCoupon.findOneAndRemove({
    coupon,
  });
};

export default {
  createProduct,
  getAllProducts,
  findProductById,
  modifyProduct,
  removeProduct,
  findExistingCoupon,
  createCoupon,
  editExistingCoupon,
  deleteCoupon,
  getUserFromId,
  getProductOwnerWithCoupon,
  addProductOwnerWithCoupon,
  editProductOwnerWithCoupon,
  removeProductOwnerWithCoupon,
};
