"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithGoogleController = exports.loginController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// src/controllers/loginController.ts
const User_1 = __importDefault(require("../schemas/User"));
// console.log(process.env.JWT_SECRET);
const loginController = async (req, res) => {
    try {
        // Input validation
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        // Find user by email
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Check password
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Password is correct, generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET);
        // Return JWT token in response
        res.status(200).json({ message: "Login successful", token });
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.loginController = loginController;
const loginWithGoogleController = async (req, res) => {
    try {
        // Input validation
        const { email, type } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email are required" });
        }
        // Find user by email
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if (type !== "google") {
            return res.status(401).json({ message: "Invalid user type" });
        }
        // Password is correct, generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET);
        // Return JWT token in response
        res.status(200).json({ message: "Login successful", token });
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.loginWithGoogleController = loginWithGoogleController;
//# sourceMappingURL=loginController.js.map