import { Request } from "express";
import { redis, redisTTL } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { NewOrderRequestBody } from "../types/types.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";

export const myOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;
  const key = `my-orders-${user}`;

  let orders = (await redis.get(key)) ? JSON.parse(await redis.get(key)) : null;

  if (!orders) {
    orders = await Order.find({ user });
    redis.setex(key, redisTTL, JSON.stringify(orders)); // Async to avoid blocking
  }

  return res.status(200).json({ success: true, orders });
});

export const allOrders = TryCatch(async (req, res, next) => {
  const key = "all-orders";

  let orders = (await redis.get(key)) ? JSON.parse(await redis.get(key)) : null;

  if (!orders) {
    orders = await Order.find().populate("user", "name");
    redis.setex(key, redisTTL, JSON.stringify(orders)); // Async to avoid blocking
  }

  return res.status(200).json({ success: true, orders });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const key = `order-${id}`;

  let order = (await redis.get(key)) ? JSON.parse(await redis.get(key)) : null;

  if (!order) {
    order = await Order.findById(id).populate("user", "name");

    if (!order) return next(new ErrorHandler("Order Not Found", 404));

    redis.setex(key, redisTTL, JSON.stringify(order)); // Async to avoid blocking
  }

  return res.status(200).json({ success: true, order });
});

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total)
      return next(new ErrorHandler("Please Enter All Fields", 400));

    if (!Array.isArray(orderItems) || orderItems.length === 0)
      return next(new ErrorHandler("Order must contain at least one item", 400));

    const order = await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });

    await Promise.all([
      reduceStock(orderItems),
      invalidateCache({
        product: true,
        order: true,
        admin: true,
        userId: user,
        productId: order.orderItems.map((i) => String(i.productId)),
      }),
    ]);

    return res.status(201).json({ success: true, message: "Order Placed Successfully" });
  }
);

export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  const statusTransitions: Record<string, string> = {
    Processing: "Shipped",
    Shipped: "Delivered",
  };

  order.status = statusTransitions[order.status] || order.status; // Prevent unintended changes
  await order.save();

  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({ success: true, message: "Order Processed Successfully" });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  await order.deleteOne();

  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({ success: true, message: "Order Deleted Successfully" });
});
