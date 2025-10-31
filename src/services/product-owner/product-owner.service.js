import Product from "../../models/product.model.js";
import Coupon from "../../models/coupon.model.js";
import User from "../../models/user.model.js";
import Cart from "../../models/cart.model.js";
import ProductOwnerInventory from "../../models/productOwnerInventory.model.js";

const getInventoryStatus = async (user) => {
  const currentUser = await User.findById(user["_id"].toString());
  return await ProductOwnerInventory.find({
    user: currentUser,
  })
    .populate("coupon")
    .populate("user");
};

const isCartAlreadyExistsForUserAndCoupon = async (data) => {
  const coupon = await Coupon.findOne({
    couponCode: data.couponCode,
  });
  if (!coupon) return false;
  const cart = await Cart.findOne({
    user: data.user,
    coupon,
  });
  if (cart) return true;
  else return false;
};

const addCouponToCartForExistingCart = async (data) => {
  await Cart.findOneAndUpdate(
    {
      user: data.user,
    },
    {
      quantityAvailable: data.currentQuantity + data.newQuantity,
    }
  );
};

const getAllCartItemsForUser = async (user) => {
  const res = [];
  const carts = await Cart.find({
    user,
  });

  for (let i = 0; i < carts.length; i++)
    res.push({
      _id: carts[i]["_id"],
      quantity: carts[i].quantityAvailable,
      coupon: await Coupon.findById(carts[i].coupon),
      user: await User.findById(carts[i].user),
    });

  return res;
};

const getAllCoupons = async () => {
  const coupons = await Coupon.find();
  return coupons;
};

const isCouponCodeExists = async (couponCode) => {
  const coupon = await Coupon.findOne({
    couponCode,
  });
  if (coupon) return true;
  else return false;
};

const getAvailableCouponQuantity = async (couponCode) => {
  const coupon = await Coupon.findOne({
    couponCode,
  });
  return coupon.availableCount;
};

const addCouponToCart = async (data) => {
  const coupon = await Coupon.findOne({
    couponCode: data.couponCode,
  });
  const user = await User.findById(data.user["_id"].toString());
  await Cart.create({
    coupon,
    user,
    quantityAvailable: data.quantityAvailable,
  });
};

const modifyCouponQuantityInCart = async (data) => {
  const coupon = await Coupon.findOne({
    couponCode: data.couponCode,
  });
  const user = await User.findById(data.user["_id"].toString());
  if (data.quantityAvailable > 0)
    await Cart.findOneAndUpdate(
      {
        coupon,
        user,
      },
      {
        quantityAvailable: data.quantityAvailable,
      }
    );
  else if (data.quantityAvailable === 0)
    await Cart.findOneAndRemove({
      coupon,
      user,
    });
};

const deleteCouponFromCart = async (data) => {
  const coupon = await Coupon.findOne({
    couponCode: data.couponCode,
  });

  const user = await User.findById(data.user["_id"].toString());

  await Cart.findOneAndRemove({
    coupon,
    user,
  });
};

export default {
  getInventoryStatus,
  isCartAlreadyExistsForUserAndCoupon,
  getAllCoupons,
  isCouponCodeExists,
  getAvailableCouponQuantity,
  getAllCartItemsForUser,
  addCouponToCart,
  addCouponToCartForExistingCart,
  modifyCouponQuantityInCart,
  deleteCouponFromCart,
};
