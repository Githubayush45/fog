import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { placeOrder, getOrdersWithUserInfo } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.get('/orders', getOrdersWithUserInfo);

export default orderRouter;
