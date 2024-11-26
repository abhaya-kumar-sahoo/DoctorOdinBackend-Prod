// src/controllers/registerController.ts
import { Request, Response } from "express";
import UserModel, { User } from "../schemas/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerController = async (req: Request, res: Response) => {
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
      "type",
    ];

    // Check if all required fields are present
    const missingFields: string[] = [];
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
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new user
    const newUser = new UserModel({
      email: req.body.email,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      age: req.body.age,
      height: req.body.height,
      weight: req.body.weight,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      userType: req.body.type,
    });

    await newUser.save();
    const token = await jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET
    );

    res
      .status(201)
      .json({ message: "User registered successfully", token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
