const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    const newQuantity = existingItem ? existingItem.quantity + qty : qty;
    if (newQuantity > product.stock) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    if (existingItem) existingItem.quantity = newQuantity;
    else cart.items.push({ product: productId, quantity: qty });

    await cart.save();
    const populated = await cart.populate("items.product");
    res.status(200).json({ message: "Item added to cart", cart: populated });
  } catch (error) { next(error); }
};

const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
    res.status(200).json({ cart });
  } catch (error) { next(error); }
};

const updateCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const qty = Number(req.body.quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (qty > product.stock) return res.status(400).json({ message: "Insufficient stock" });

    item.quantity = qty;
    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) { next(error); }
};

const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const before = cart.items.length;
    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);

    if (cart.items.length === before) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) { next(error); }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) { next(error); }
};

module.exports = { addToCart, getCart, updateCart, removeFromCart, clearCart };
