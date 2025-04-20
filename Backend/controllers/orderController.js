import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import axios from "axios";

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Create Cashfree order
        try {
            // Validate required fields
            if (!process.env.CASHFREE_API_KEY || !process.env.CASHFREE_API_SECRET) {
                throw new Error('Cashfree API credentials are missing');
            }

            if (!req.body.amount || !req.body.email || !req.body.phone) {
                throw new Error('Missing required payment details');
            }

            const payload = {
                order_id: newOrder._id.toString(),
                order_amount: req.body.amount,
                order_currency: 'INR',
                customer_details: {
                    customer_id: req.body.userId,
                    customer_email: req.body.email,
                    customer_phone: req.body.phone,
                },
                order_meta: {
                    return_url: `${frontend_url}/verify?order_id={order_id}&order_token={order_token}`,
                },
            };

            console.log('Cashfree Request Payload:', payload);

            const response = await axios.post('https://sandbox.cashfree.com/pg/orders', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-id': process.env.CASHFREE_API_KEY,
                    'x-client-secret': process.env.CASHFREE_API_SECRET,
                },
                timeout: 10000 // 10 second timeout
            });

            if (!response.data.payment_link) {
                throw new Error('No payment link received from Cashfree');
            }

            console.log('Cashfree Payment Link:', response.data.payment_link);
            res.json({ success: true, payment_link: response.data.payment_link });
        } catch (error) {
            console.error('Cashfree Error:', {
                message: error.message,
                response: error.response?.data,
                stack: error.stack
            });
            res.status(500).json({ 
                success: false, 
                message: 'Failed to create payment link',
                error: error.message,
                details: error.response?.data 
            });

        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error creating order' });
    }
};

// Generate Payment Session ID
const generatePaymentSession = async (req, res) => {
    try {
        const { orderId, orderAmount, customerDetails } = req.body;

        const response = await axios.post('https://sandbox.cashfree.com/pg/orders', {
            order_id: orderId,
            order_amount: orderAmount,
            order_currency: 'INR',
            customer_details: customerDetails,
            order_meta: {
                return_url: `http://localhost:5173/verify?order_id={order_id}&order_token={order_token}`,
            },
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': process.env.CASHFREE_API_KEY,
                'x-client-secret': process.env.CASHFREE_API_SECRET,
            },
        });

        res.json({ success: true, paymentSessionId: response.data.payment_session_id });
    } catch (error) {
        console.error('Error generating payment session:', error.response?.data || error.message);
        res.status(500).json({ success: false, message: 'Failed to generate payment session', error: error.response?.data || error.message });
    }
};

export { placeOrder, generatePaymentSession };
