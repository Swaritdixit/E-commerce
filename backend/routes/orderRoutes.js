const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

router.get(
  "/admin/all",
  authMiddleware,
  authorize("Admin", "SuperAdmin"),
  getAllOrders
);

router.put(
  "/admin/:id/status",
  authMiddleware,
  authorize("Admin", "SuperAdmin"),
  updateOrderStatus
);

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getMyOrders);
router.put("/:id/cancel", authMiddleware, cancelOrder);
router.get("/:id", authMiddleware, getOrderById);

module.exports = router;
