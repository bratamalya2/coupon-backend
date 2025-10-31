import Stripe from "stripe";

import catchAsync from "../../helpers/asyncErrorHandler.js";
import ApiError from "../../helpers/apiErrorConverter.js";
import service from "../../services/payment/payment.service.js";
import config from "../../config/config.js";

const stripe = Stripe(config.stripe.STRIPE_API_KEY);

const checkout = catchAsync(async (req, res) => {
  const { cartIds } = req.body;

  const isCartExistsArr = await service.isCartExists(cartIds);

  isCartExistsArr.forEach(async (flag) => {
    if (!flag) throw new ApiError("No matching cart found", 404);
  });

  const cartItems = await service.getCartInfoForAllItems(cartIds);

  cartItems.forEach((item) => {
    if (req.user["_id"].toString() !== item.user["_id"].toString())
      throw new ApiError("Cart and user are not matching", 403);
  });

  const coupons = await service.getCouponInfos(
    cartItems.map((item) => item.coupon["_id"].toString())
  );

  for (let i = 0; i < cartItems.length; i++) {
    for (let j = 0; j < coupons.length; j++) {
      if (
        cartItems[i].coupon["_id"].toString() ===
          coupons[j]["_id"].toString() &&
        cartItems[i].quantityAvailable > coupons[j].availableCount
      )
        throw new ApiError("Insufficient coupon quantity available", 409);
    }
  }

  const prices = [];

  for (let i = 0; i < coupons.length; i++)
    prices.push(
      await stripe.prices.create({
        currency: "usd",
        unit_amount: coupons[i].couponPrice,
        product_data: {
          name: `COUPON ${coupons[i].couponCode}`,
        },
      })
    );

  const line_items = [];

  for (let i = 0; i < cartItems.length; i++)
    line_items.push({
      price: prices[i].id,
      quantity: cartItems[i].quantityAvailable,
    });

  const purchasedCartIds = cartItems.map((c) => c["_id"].toString());
  let success_url = `${
    config.server.BACKEND_URL
  }/v1/payment/success?cartIds=${JSON.stringify(purchasedCartIds)}&user=${JSON.stringify(req.user)}`;

  const session = await stripe.checkout.sessions.create({
    success_url,
    line_items,
    mode: "payment",
  });

  res.status(201).json({
    success: true,
    msg: "Payment successfully initiated!",
    url: session.url,
  });
});

const success = catchAsync(async (req, res) => {
  const cartIds = JSON.parse(req.query.cartIds);
  const user = JSON.parse(req.query.user);

  const carts = [];

  for (let i = 0; i < cartIds.length; i++)
    carts.push(await service.getCartInfo(cartIds[i]));

  await service.reduceCouponQtyAfterSale(
    carts.map((cart) => cart.coupon["_id"].toString()),
    carts.map((cart) => cart.quantityAvailable)
  );

  await service.addCouponsToInventory(
    user,
    carts.map((cart) => cart.coupon["_id"].toString()),
    carts.map((cart) => cart.quantityAvailable)
  );

  await service.removeIndividualCarts(cartIds);

  res.status(200).json({
    success: true,
    msg: "Payment successful!",
  });
});

export default {
  checkout,
  success,
};
