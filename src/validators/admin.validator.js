import Joi from "joi";

const addItem = Joi.object({
  productName: Joi.string().required(),
  productPrice: Joi.number().min(0).required(),
  productDescription: Joi.string().required(),
  productImageURL: Joi.string().optional(),
});

const modifyItem = Joi.object({
  productId: Joi.string().required(),
  productName: Joi.string().optional(),
  productPrice: Joi.number().min(0).optional(),
  productDescription: Joi.string().optional(),
  productImageURL: Joi.string().optional(),
});

const deleteItem = Joi.object({
  productId: Joi.string().required(),
});

const createCoupon = Joi.object({
  couponCode: Joi.string().required(),
  couponPrice: Joi.number().min(0).required(),
  discountPercentage: Joi.number().min(0).required(),
  availableCount: Joi.number().required(),
  productId: Joi.string().required(),
  productOwnerId: Joi.string().required(),
});

const editCoupon = Joi.object({
  couponCode: Joi.string().required(),
  couponPrice: Joi.number().min(0).optional(),
  discountPercentage: Joi.number().min(0).optional(),
  availableCount: Joi.number().optional(),
  productId: Joi.string().required(),
  productOwnerId: Joi.string().optional(),
});

const removeCoupon = Joi.object({
  couponCode: Joi.string().required(),
});

export default {
  addItem,
  modifyItem,
  deleteItem,
  createCoupon,
  editCoupon,
  removeCoupon,
};
