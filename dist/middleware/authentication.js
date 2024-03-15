"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLogin = void 0;
// src/middleware/authentication.ts
const User_1 = __importDefault(require("../schemas/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isLogin = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Unauthorized: Invalid token" });
        }
        const user = await User_1.default.findOne({ _id: Object(decoded).userId });
        if (user) {
            req.user = decoded;
            next();
        }
        else {
            return res.status(403).json({ message: "Unauthorized: Invalid token" });
        }
        // console.log("decoded", Object(userId).userId);
        // console.log("userId")
        // Attach decoded user info to the request object for further use
    });
};
exports.isLogin = isLogin;
//# sourceMappingURL=authentication.js.map