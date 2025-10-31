import Joi from "joi";

const addCouponToCart = Joi.object({
  quantity: Joi.number().min(0).required(),
  couponCode: Joi.string().required(),
});

const modifyCouponQuantityInCart = Joi.object({
  quantity: Joi.number().min(0).required(),
  couponCode: Joi.string().required()
});

const deleteCouponFromCart = Joi.object({
  couponCode: Joi.string().required()
});

export default {
  addCouponToCart,
  modifyCouponQuantityInCart,
  deleteCouponFromCart
};
