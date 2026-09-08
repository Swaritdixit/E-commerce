const crypto = require("crypto");
const Razorpay = require("../config/razorpay");
const Order = require("../models/Order");

const createPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user.id });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.paymentStatus === "Paid") return res.status(400).json({ message: "Order already paid" });

    const razorpayOrder = await Razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: order._id.toString(),
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      message: "Razorpay order created",
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) { next(error); }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Incomplete payment response" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, user: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentStatus === "Paid") {
      return res.status(200).json({ message: "Payment already verified" });
    }

    order.paymentId = razorpay_payment_id;
    order.paymentStatus = "Paid";
    order.orderStatus = "Processing";
    await order.save();

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) { next(error); }
};

const paymentWebhook = async (req, res, next) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const rawBody = req.rawBody;
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !rawBody || !secret) {
      return res.status(400).json({ message: "Invalid webhook request" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const body = JSON.parse(rawBody.toString("utf8"));
    const event = body.event;
    const payment = body.payload?.payment?.entity;

    if (!payment?.order_id) return res.status(200).json({ message: "Webhook ignored" });

    const order = await Order.findOne({ razorpayOrderId: payment.order_id });
    if (!order) return res.status(200).json({ message: "Order not found" });

    if (event === "payment.captured") {
      order.paymentId = payment.id;
      order.paymentStatus = "Paid";
      order.orderStatus = "Processing";
      await order.save();
    } else if (event === "payment.failed") {
      order.paymentStatus = "failed";
      await order.save();
    }

    res.status(200).json({ message: "Webhook processed" });
  } catch (error) { next(error); }
};

const refundPayment = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.paymentStatus !== "Paid") return res.status(400).json({ message: "Order is not paid" });
    if (!order.paymentId) return res.status(400).json({ message: "No Razorpay payment ID found" });

    const refund = await Razorpay.payments.refund(order.paymentId, {
      amount: Math.round(order.totalAmount * 100),
      speed: "optimum",
    });

    order.paymentStatus = "RefundPending";
    order.refundId = refund.id;
    await order.save();

    res.status(200).json({ message: "Refund initiated successfully", refund });
  } catch (error) { next(error); }
};

module.exports = { createPayment, verifyPayment, paymentWebhook, refundPayment };
