import catchAsync from "../../helpers/asyncErrorHandler.js";
import ApiError from "../../helpers/apiErrorConverter.js";
import service from "../../services/product-owner/product-owner.service.js";

const getAllCoupons = catchAsync(async (req, res) => {
  const coupons = await service.getAllCoupons();

  res.status(201).json({
    success: true,
    coupons,
  });
});

const getAllCartItems = catchAsync(async (req, res) => {
  const cartItems = await service.getAllCartItemsForUser(req.user);

  res.status(200).json({
    success: true,
    cartItems
  });
});

const addCouponToCart = catchAsync(async (req, res) => {
  const { quantity, couponCode } = req.body;

  const isCouponValid = await service.isCouponCodeExists(couponCode);

  if (!isCouponValid) throw new ApiError("Coupon not found", 404);

  const availableQuantity = await service.getAvailableCouponQuantity(
    couponCode
  );

  if (availableQuantity < quantity)
    throw new ApiError("Insufficient coupons available", 404);

  const isCartAlreadyExistsForUserAndCoupon = await service.isCartAlreadyExistsForUserAndCoupon({
    user: req.user,
    couponCode
  });

  if (isCartAlreadyExistsForUserAndCoupon) {
    const currentCart = await service.getAllCartItemsForUser(req.user);

    if(availableQuantity < currentCart.quantityAvailable + quantity)
      throw new ApiError("Insufficient coupons available", 404);

    await service.addCouponToCartForExistingCart({
      couponCode,
      user: req.user,
      newQuantity: quantity,
      currentQuantity: currentCart.quantityAvailable
    });
  }
  else
    await service.addCouponToCart({
      couponCode,
      user: req.user,
      quantityAvailable: quantity,
    });

  res.status(201).json({
    success: true,
    msg: "Coupon added to cart!",
  });
});

const modifyCouponQuantityInCart = catchAsync(async (req, res) => {
  const { quantity, couponCode } = req.body;

  const isCouponValid = await service.isCouponCodeExists(couponCode);

  if (!isCouponValid) throw new ApiError("Coupon not found", 404);

  const availableQuantity = await service.getAvailableCouponQuantity(
    couponCode
  );

  if (availableQuantity < quantity)
    throw new ApiError("Insufficient coupons available", 404);

  await service.modifyCouponQuantityInCart({
    couponCode,
    user: req.user,
    quantityAvailable: quantity,
  });

  res.status(201).json({
    success: true,
    msg: "Coupon updated in cart!",
  });
});

const deleteCouponFromCart = catchAsync(async (req, res) => {
  const { couponCode } = req.body;

  const isCouponValid = await service.isCouponCodeExists(couponCode);

  if (!isCouponValid) throw new ApiError("Coupon not found", 404);

  await service.deleteCouponFromCart({
    couponCode,
    user: req.user,
  });

  res.status(201).json({
    success: true,
    msg: "Coupon removed from cart!",
  });
});

const getInventoryStatus = catchAsync(async (req, res) => {
  const inventory = await service.getInventoryStatus(req.user);

  res.status(201).json({
    success: true,
    inventory
  });
});

export default {
  getAllCoupons,
  getInventoryStatus,
  getAllCartItems,
  addCouponToCart,
  modifyCouponQuantityInCart,
  deleteCouponFromCart,
};
