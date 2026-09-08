const express = require("express");
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const reviewSchema = require("../validators/reviewValidator");
const validateObjectId = require("../models/validateObjectId");

const router = express.Router();

router.get("/product/:productId", validateObjectIdForProduct, getProductReviews);
router.post("/", authMiddleware, validate(reviewSchema), createReview);
router.put("/:id", authMiddleware, validateObjectId, validate(reviewSchema), updateReview);
router.delete("/:id", authMiddleware, validateObjectId, deleteReview);

function validateObjectIdForProduct(req, res, next) {
  const mongoose = require("mongoose");
  if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  next();
}

module.exports = router;
