const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");
const authMiddleware = require("../middleware/authMiddleware");

const checkValidation = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ errors: result.array() });
  next();
};

const addressValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
  body("addressLine1").trim().notEmpty().withMessage("Address Line 1 is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("postalCode").trim().notEmpty().withMessage("Postal Code is required"),
  body("country").trim().notEmpty().withMessage("Country is required"),
];

router.get("/", authMiddleware, getAddress);
router.post("/", authMiddleware, addressValidation, checkValidation, addAddress);
router.put("/:addressId", authMiddleware, addressValidation, checkValidation, updateAddress);
router.delete("/:addressId", authMiddleware, deleteAddress);

module.exports = router;
