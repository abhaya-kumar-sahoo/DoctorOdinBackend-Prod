"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isLogin = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Unauthorized: Invalid token" });
        }
        // Attach decoded user info to the request object for further use
        req.user = decoded;
        next();
    });
};
exports.isLogin = isLogin;
//# sourceMappingURL=authentication.js.map