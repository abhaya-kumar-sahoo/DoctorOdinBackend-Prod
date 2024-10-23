// src/schemas/User.ts
import mongoose, { Document } from "mongoose";

export interface User extends Document {
  email: string;
  password: string;
  phoneNumber: string;
  age: number;
  height: number;
  weight: number;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  otp: string;
}

const userSchema = new mongoose.Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  age: { type: Number, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  otp: {
    type: String,
  },
});

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
