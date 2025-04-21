import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Since payment integration is not done, directly confirm order
        res.json({ 
            success: true, 
            message: 'Order confirmed. Payment integration is not done yet.' 
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error creating order' });
    }
};

// ✅ Fixed: Missing closing brace
const getOrdersWithUserInfo = async (req, res) => {
    try {
        const orders = await orderModel.find()
            .sort({ date: -1 })
            .populate('userId', 'name email');

        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error in getOrdersWithUserInfo:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching orders', 
            error: error.message 
        });
    }
};

// ✅ New function to update order status
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, message: 'Order status updated', order: updatedOrder });
    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating order status', 
            error: error.message 
        });
    }
};

// ✅ Final export with all three functions
export { placeOrder, getOrdersWithUserInfo, updateOrderStatus };
