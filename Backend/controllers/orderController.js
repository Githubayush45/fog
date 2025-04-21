import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            status: "processing", // default status
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ 
            success: true, 
            message: 'Order confirmed. Payment integration is not done yet.' 
        });

    } catch (error) {
        console.error(error);

        // Save as "pending" if something goes wrong during order placement
        try {
            const pendingOrder = new orderModel({
                userId: req.body.userId,
                items: req.body.items,
                amount: req.body.amount,
                address: req.body.address,
                status: "pending",
            });
            await pendingOrder.save();

            res.json({ 
                success: true, 
                message: 'Order saved as pending due to an issue during placement.' 
            });
        } catch (fallbackError) {
            console.error('Fallback error while saving pending order:', fallbackError);
            res.json({ 
                success: false, 
                message: 'Order failed and could not be saved as pending either.' 
            });
        }
    }
};


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
const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const { status } = req.query;

        let filter = { userId };
        if (status && ['pending', 'processing', 'delivered', 'cancelled'].includes(status.toLowerCase())) {
            filter.status = new RegExp(`^${status}$`, 'i');  // <--- FIXED
        }

        const orders = await orderModel.find(filter).sort({ date: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error in getUserOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user orders',
            error: error.message
        });
    }
};

export { placeOrder, getOrdersWithUserInfo, updateOrderStatus, getUserOrders };
