const express = require("express");
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");
const productSchema = require("../validators/productValidators");
const validateObjectId = require("../models/validateObjectId");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", validateObjectId, getProductById);

router.post(
  "/",
  authMiddleware,
  authorize("Admin", "SuperAdmin"),
  upload.array("images", 5),
  validate(productSchema),
  addProduct
);

router.put(
  "/:id",
  authMiddleware,
  authorize("Admin", "SuperAdmin"),
  validateObjectId,
  upload.array("images", 5),
  validate(productSchema),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("Admin", "SuperAdmin"),
  validateObjectId,
  deleteProduct
);

module.exports = router;
