const express = require("express");
const {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const validateObjectId = require("../models/validateObjectId");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", validateObjectId, getCategoryById);

router.post(
  "/",
  authMiddleware,
  authorize("Admin", "SuperAdmin"),
  addCategory
);
router.put(
  "/:id",
  authMiddleware,
  authorize("Admin", "SuperAdmin"),
  validateObjectId,
  updateCategory
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("Admin", "SuperAdmin"),
  validateObjectId,
  deleteCategory
);

module.exports = router;
