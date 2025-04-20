import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        const userData = await userModel.findOne({ _id: req.userId }); // use req.userId

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.userId, { cartData }); // use req.userId

        res.json({ success: true, message: "Item added to cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove items from cart
const removeFromCart = async (req, res) => {
    try {
        const userData = await userModel.findOne({ _id: req.userId }); // use req.userId

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};

        if (cartData[req.body.itemId]) {
            cartData[req.body.itemId] -= 1;

            if (cartData[req.body.itemId] <= 0) {
                delete cartData[req.body.itemId];
            }
        }

        await userModel.findByIdAndUpdate(req.userId, { cartData }); // use req.userId

        res.json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


// Fetch user cart data
const getCart = async (req, res) => {
    try {
        const userData = await userModel.findOne({ _id: req.userId }); // ✅ Use req.userId

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};





export { addToCart, removeFromCart, getCart };
