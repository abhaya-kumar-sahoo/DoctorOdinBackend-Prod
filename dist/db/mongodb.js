"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        console.log("DATABASE URL", process.env.DATABASE_URL);
        // mongoose.connect("mongodb://localhost:27017/drodin", {
        mongoose_1.default.connect(process.env.DATABASE_URL, {
            serverSelectionTimeoutMS: 10000, // Increase timeout for server selection
            socketTimeoutMS: 45000, // Increase timeout for individual operations
        });
        const db = mongoose_1.default.connection;
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", () => {
            console.log("Connected to MongoDB");
        });
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=mongodb.js.map