import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { placeOrder, getOrdersWithUserInfo, updateOrderStatus, getUserOrders } from '../controllers/orderController.js';

const orderRouter = express.Router();
orderRouter.get('/', (req, res) => {
    res.send("Orders API is working");
  });
  
orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.get('/orders', getOrdersWithUserInfo);
orderRouter.get('/user/orders', authMiddleware, getUserOrders);
orderRouter.patch('/order/:id/status', authMiddleware, updateOrderStatus);

export default orderRouter;
