import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URL);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};
