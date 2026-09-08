const express=require("express");
const router=express.Router();
const {body}=require("express-validator");
const loginLimiter = require("../middleware/rateMiddleware");
const {loginUser,registerUser}=require("../controllers/userController");

router.post("/register",body("name").trim().notEmpty().withMessage("Name id required"),
                 body("email").isEmail().withMessage("Enter valid email"),
                 body("password").isLength({min:8}).withMessage("password must be length 8"),registerUser);


router.post("/login",body("email").isEmail().withMessage("Enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),loginLimiter,loginUser);
module.exports=router;