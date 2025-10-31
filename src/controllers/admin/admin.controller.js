import catchAsync from "../../helpers/asyncErrorHandler.js";
import ApiError from "../../helpers/apiErrorConverter.js";
import service from "../../services/admin/admin.service.js";

const addItem = catchAsync(async (req, res) => {
  const { productName, productPrice, productDescription, productImageURL } =
    req.body;
  if (productImageURL)
    await service.createProduct({
      productName,
      productPrice,
      productDescription,
      productImageURL,
    });
  else
    await service.createProduct({
      productName,
      productPrice,
      productDescription,
    });

  res.status(201).json({
    success: true,
    msg: "Product added!",
  });
});

const getAllItems = catchAsync(async (req, res) => {
  const x = await service.getAllProducts();

  res.status(201).json({
    success: true,
    products: x,
  });
});

const modifyItem = catchAsync(async (req, res) => {
  const {
    productId,
    productName,
    productPrice,
    productDescription,
    productImageURL,
  } = req.body;
  const newItem = {};

  if (productName) newItem.productName = productName;
  if (productPrice) newItem.productPrice = productPrice;
  if (productDescription) newItem.productDescription = productDescription;
  if (productImageURL) newItem.productImageURL = productImageURL;

  const product = await service.findProductById(productId);

  if (!product) throw new ApiError("Item not found", 404);

  await service.modifyProduct(productId, newItem);

  res.status(201).json({
    success: true,
    msg: "Product updated!",
  });
});

const deleteItem = catchAsync(async (req, res) => {
  const { productId } = req.body;

  const x = await service.findProductById(productId);

  if (!x) throw new ApiError("Item not found", 404);

  await service.removeProduct(productId);

  res.status(201).json({
    success: true,
    msg: "Product deleted!",
  });
});

const createCoupon = catchAsync(async (req, res) => {
  const {
    couponCode,
    couponPrice,
    discountPercentage,
    availableCount,
    productId,
    productOwnerId,
  } = req.body;

  const product = await service.findProductById(productId);

  if (!product) throw new ApiError("Item not found", 404);

  const existingCoupon = await service.findExistingCoupon(couponCode);

  if (!(await service.getUserFromId(productOwnerId)))
    throw new ApiError("Product Owner id does not exists!", 401);

  if (existingCoupon)
    return res.status(403).json({
      success: false,
      err: "Coupon code already exists!",
    });

  if (await service.getProductOwnerWithCoupon(couponCode))
    throw new ApiError("Coupon Code already belongs to a product owner!", 403);

  await service.createCoupon({
    couponCode,
    couponPrice,
    discountPercentage,
    availableCount,
    productId,
  });

  await service.addProductOwnerWithCoupon(productOwnerId, couponCode);

  res.status(201).json({
    success: true,
    msg: "Added coupon!",
  });
});

const editCoupon = catchAsync(async (req, res) => {
  const {
    couponCode,
    couponPrice,
    discountPercentage,
    availableCount,
    productId,
    productOwnerId,
  } = req.body;

  const product = await service.findProductById(productId);

  if (!product) throw new ApiError("Item not found", 404);

  const existingCoupon = await service.findExistingCoupon(couponCode);

  if (!existingCoupon) throw new ApiError("Coupon code does not exists!", 403);

  if (!(await service.getProductOwnerWithCoupon(couponCode)))
    throw new ApiError(
      "Coupon code does not belong to any product owner!",
      403
    );

  await service.editExistingCoupon({
    couponCode,
    couponPrice,
    discountPercentage,
    availableCount,
    productId,
  });

  if (productOwnerId)
    await service.editProductOwnerWithCoupon(productOwnerId, couponCode);

  res.status(201).json({
    success: true,
    msg: "Modified coupon!",
  });
});

const removeCoupon = catchAsync(async (req, res) => {
  const { couponCode } = req.body;

  const existingCoupon = await service.findExistingCoupon(couponCode);

  if (!existingCoupon) throw new ApiError("Coupon code does not exists!", 403);

  if (!(await service.getProductOwnerWithCoupon(couponCode)))
    throw new ApiError(
      "No matching product owner found for this coupon code!",
      404
    );

  await service.deleteCoupon(couponCode);

  await service.removeProductOwnerWithCoupon(couponCode);

  res.status(201).json({
    success: true,
    msg: "Deleted coupon!",
  });
});

export default {
  addItem,
  getAllItems,
  modifyItem,
  deleteItem,
  createCoupon,
  editCoupon,
  removeCoupon,
};
