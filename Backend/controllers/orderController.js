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

export { placeOrder };
