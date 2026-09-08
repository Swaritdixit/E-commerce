const express = require("express");
const router = express.Router();

const {
  createPayment,
  verifyPayment,
  paymentWebhook,
  refundPayment,
} = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-payment", authMiddleware, createPayment);
router.post("/verify-payment", authMiddleware, verifyPayment);
router.post("/webhook", paymentWebhook);
router.post("/refund/:id", authMiddleware, refundPayment);

module.exports = router;
