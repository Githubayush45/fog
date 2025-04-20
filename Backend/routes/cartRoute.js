import express from 'express';

import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';
const cartRouter = express.Router();


cartRouter.post('/add',authMiddleware, addToCart); // Add item to cart
cartRouter.post('/remove',authMiddleware, removeFromCart); // Remove item from cart
cartRouter.get('/get',authMiddleware, getCart); // Get cart items

export default cartRouter;