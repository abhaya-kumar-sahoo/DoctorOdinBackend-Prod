import mongoose from "mongoose";
import config from "dotenv";
config.config();
export const connectDB = async () => {
  try {
    console.log("DATABASE URL", process.env.DATABASE_URL);
    // mongoose.connect("mongodb://localhost:27017/drodin", {

    mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 10000, // Increase timeout for server selection
      socketTimeoutMS: 45000, // Increase timeout for individual operations
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};
