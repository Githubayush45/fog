import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Function to create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" }); // optional expiry
};

// LOGIN USER
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        return res.status(200).json({
            success: true,
            token,
            message: "Login successful!"
        });

    } catch (error) {
        console.error("Login error:", {
            message: error.message,
            stack: error.stack,
            requestData: req.body
        });
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again."
        });
    }
};

// REGISTER USER
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Email and password validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter valid email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }
        if (!name || name.length < 3) {
            return res.status(400).json({ success: false, message: "Name must be at least 3 characters" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        const user = await newUser.save();
        const token = createToken(user._id);

        return res.status(201).json({
            success: true,
            token,
            message: "Account created successfully!"
        });

    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again."
        });
    }
};

export { loginUser, registerUser };
