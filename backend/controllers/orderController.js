const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");

const createOrder = async (req, res, next) => {
  try {
    const { addressId } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;
      if (!product) return res.status(404).json({ message: "Product not found" });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
      }

      totalAmount += item.quantity * product.price;
      orderItems.push({ product: product._id, quantity: item.quantity, price: product.price });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress: {
        name: address.name,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      orderStatus: "Pending",
    });

    for (const item of cart.items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) {
        return res.status(409).json({ message: "Stock changed. Please try again." });
      }
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) { next(error); }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) { next(error); }
};

const getOrderById = async (req, res, next) => {
  try {
    const query = { _id: req.params.id };
    if (!["Admin", "SuperAdmin"].includes(req.user.role)) query.user = req.user.id;

    const order = await Order.findOne(query).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ order });
  } catch (error) { next(error); }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!["Pending", "Processing"].includes(order.orderStatus)) {
      return res.status(400).json({ message: "This order cannot be cancelled" });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) { next(error); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const statusFlow = {
      Pending: ["Processing", "Cancelled"],
      Processing: ["Shipped", "Cancelled"],
      Shipped: ["Delivered"],
      Delivered: [],
      Cancelled: [],
    };

    if (!statusFlow[order.orderStatus].includes(status)) {
      return res.status(400).json({
        message: `Cannot change order status from ${order.orderStatus} to ${status}`,
      });
    }

    order.orderStatus = status;
    await order.save();
    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) { next(error); }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) { next(error); }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
