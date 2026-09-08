const express=require('express');
const {getCart,addToCart,updateCart,removeFromCart,clearCart}=require('../controllers/cartController');
const authMiddleware=require('../middleware/authMiddleware');
const router=express.Router();
router.get('/',authMiddleware,getCart);
router.post('/add',authMiddleware,addToCart);
router.put('/:productId',authMiddleware,updateCart);
router.delete('/clear',authMiddleware,clearCart);

router.delete('/:productId',authMiddleware,removeFromCart);
module.exports=router;