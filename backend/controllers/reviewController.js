const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const purchased = await Order.findOne({
      user: req.user.id,
      orderStatus: "Delivered",
      "items.product": productId,
    });

    if (!purchased) {
      return res.status(403).json({ message: "You can only review products you have purchased" });
    }

    const existingReview = await Review.findOne({ user: req.user.id, product: productId });
    if (existingReview) return res.status(409).json({ message: "You have already reviewed this product" });

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment,
    });

    res.status(201).json({ message: "Review created", review });
  } catch (error) { next(error); }
};

const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    res.status(200).json({ reviews, totalReviews, averageRating });
  } catch (error) { next(error); }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user.id });
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.rating = req.body.rating;
    review.comment = req.body.comment;
    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) { next(error); }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user.id });
    if (!review) return res.status(404).json({ message: "Review not found" });

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) { next(error); }
};

module.exports = { createReview, getProductReviews, updateReview, deleteReview };
