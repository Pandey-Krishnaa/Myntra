import catchAsync from "./../utils/catchAsync.js";
import Order from "./../models/orderSchema.js";
import ApiError from "../utils/ApiError.js";
import Product from "./../models/productSchema.js";
export const createOrder = catchAsync(async (req, res, next) => {
  console.log("called");
  const { address, items, totalAmount } = req.body;
  if (!address || !items || !totalAmount)
    return next(new ApiError(400, "insufficient data"));
  const order = await Order.create({
    address,
    items,
    totalAmount,
    customer: req.user._id,
  });
  order.orderId = order._id;
  order.save();
  res.status(200).json({ order });
});

export const getMyOrders = catchAsync(async (req, res, next) => {
  const myOrders = await Order.find({ customer: req.user._id });
  res.status(200).json({ results: myOrders.length, myOrders });
});
export const getMyOrderById = catchAsync(async (req, res, next) => {
  const id = req.params.orderId;
  const order = await Order.findOne({ _id: id, customer: req.user._id }).sort(
    "-createdAt"
  );
  if (!order)
    return next(new ApiError(404, `no order having ${req.params.orderId}`));
  res.status(200).json({ order });
});

export const detailedOrderData = catchAsync(async (req, res, next) => {
  const id = req.params.orderId;
  let order = await Order.findOne({ _id: id, customer: req.user._id });
  const itemPromises = order.items.map((item) =>
    Product.findById(item.product_id)
  );
  const items = await Promise.all(itemPromises);

  const cpy = { ...order };
  const data = cpy._doc;
  data.items = items;
  res.status(200).json({
    data,
  });
});

export const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().sort("-createdAt");
  res.status(200).json({ totalOrders: orders.length, orders });
});

export const updateOrderStatus = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const orderId = req.params.orderId;
  const status = req.body.orderStatus;
  const order = await Order.findById(orderId);
  if (!order) return next(new ApiError(404, "order does not exists"));
  const validStatus = ["dispatched", "delivered", "cancelled"];
  if (!validStatus.includes(status))
    return next(new ApiError(400, "invalid status"));
  if (order.orderStatus === "delivered" || order.orderStatus === "cancelled")
    return next(
      new ApiError(
        400,
        `order has ${order.orderStatus} now the status can't be update`
      )
    );
  if (order.orderStatus === status)
    return next(new ApiError(400, `order has already ${status}`));

  if (order.orderStatus === "processing") {
    const productsPromises = order.items.map((item) =>
      Product.findById(item.product_id)
    );
    const products = await Promise.all(productsPromises);
    const productPromises = products.map((product, i) => {
      product.countInStock -= order.items[i].quantity;
      product.save();
    });
    await Promise.all(productPromises);
  }
  order.orderStatus = status;
  await order.save();
  res.status(200).json({ order });
});
