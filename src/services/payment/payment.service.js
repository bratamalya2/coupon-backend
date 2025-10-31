import mongoose from "mongoose";

import Cart from "../../models/cart.model.js";
import Coupon from "../../models/coupon.model.js";
import User from "../../models/user.model.js";
import ProductOwnerInventory from "../../models/productOwnerInventory.model.js";

const isCartExists = async (cartIds) => {
  const arr = [];
  cartIds.map(async (id) => {
    if (await Cart.findById(id)) arr.push(true);
    else arr.push(false);
  });
  return arr;
};

const getCartInfo = async (cartId) => {
  return await Cart.findById(cartId);
};

const getCartInfoForAllItems = async (arr) => {
  const objectIds = arr.map((id) => new mongoose.Types.ObjectId(id));
  const carts = await Cart.find({ _id: { $in: objectIds } }).populate(
    "coupon",
    "user"
  );
  return carts;
};

const getCouponInfos = async (arr) => {
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    res.push(await Coupon.findById(arr[i]));
  }
  return res;
};

const reduceCouponQtyAfterSale = async (couponIds, purchasedQuantities) => {
  const updates = couponIds.map(async (couponId, index) => {
    const qtyToReduce = purchasedQuantities[index];
    return await Coupon.updateOne(
      { _id: couponId },
      { $inc: { availableCount: -qtyToReduce } }
    );
  });

  await Promise.all(updates);
};

const removeIndividualCarts = async (cartIds) => {
  await Cart.deleteMany({
    _id: {
      $in: cartIds.map((id) => new mongoose.Types.ObjectId(id)),
    },
  });
};

const addCouponsToInventory = async (user, couponIds, quantities) => {
  const currentUser = await User.findById(user.id);
  for (let i = 0; i < couponIds.length; i++) {
    const coupon = await Coupon.findById(couponIds[i]);
    const exisitingItemInInventory = await ProductOwnerInventory.findOne({
      user: currentUser,
      coupon,
    });
    if (!exisitingItemInInventory)
      await ProductOwnerInventory.create({
        user: currentUser,
        coupon,
        quantityAvailable: quantities[i],
      });
    else
      await ProductOwnerInventory.findByIdAndUpdate(exisitingItemInInventory["_id"].toString(), {
        quantityAvailable: exisitingItemInInventory.quantityAvailable + quantities[i]
      });
  }
};

export default {
  isCartExists,
  getCartInfo,
  getCartInfoForAllItems,
  getCouponInfos,
  reduceCouponQtyAfterSale,
  removeIndividualCarts,
  addCouponsToInventory,
};
