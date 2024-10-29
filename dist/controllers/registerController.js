"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = void 0;
const User_1 = __importDefault(require("../schemas/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerController = async (req, res) => {
    try {
        // Define required fields
        const requiredFields = [
            "email",
            "password",
            "phoneNumber",
            "age",
            "height",
            "weight",
            "firstName",
            "lastName",
            "gender",
        ];
        // Check if all required fields are present
        const missingFields = [];
        requiredFields.forEach((field) => {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        });
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(", ")}`,
            });
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash the password
        const hashedPassword = await bcryptjs_1.default.hash(req.body.password, 10);
        // Create new user
        const newUser = new User_1.default({
            email: req.body.email,
            password: hashedPassword,
            phoneNumber: req.body.phoneNumber,
            age: req.body.age,
            height: req.body.height,
            weight: req.body.weight,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            gender: req.body.gender,
        });
        await newUser.save();
        const token = await jsonwebtoken_1.default.sign({ userId: newUser._id }, process.env.JWT_SECRET);
        res
            .status(201)
            .json({ message: "User registered successfully", token, user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
exports.registerController = registerController;
//# sourceMappingURL=registerController.js.map