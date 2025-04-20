import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { placeOrder, generatePaymentSession } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);

// Route to generate payment session
orderRouter.post('/generate-payment-session', generatePaymentSession);

export default orderRouter;