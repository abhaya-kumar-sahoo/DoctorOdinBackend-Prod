import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// src/controllers/loginController.ts
import UserModel from "@Odin/schemas/User";
import { Request, Response } from "express";
// console.log(process.env.JWT_SECRET);
export const loginController = async (req: Request, res: Response) => {
  try {
    // Input validation
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Password is correct, generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Return JWT token in response
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
