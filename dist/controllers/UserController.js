"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProfile = void 0;
const User_1 = __importDefault(require("../schemas/User"));
const getMyProfile = async (req, res) => {
    try {
        if (!req?.user) {
            return res
                .status(401)
                .json({ message: "Unauthorized: No user logged in" });
        }
        // Find user by email
        const user = await User_1.default.findById(req?.user?.userId).select("-password");
        // Return JWT token in response
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getMyProfile = getMyProfile;
//# sourceMappingURL=UserController.js.map