// src/middleware/authentication.ts
import UserModel from "@Odin/schemas/User";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const isLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }
    const user = await UserModel.findOne({ _id: Object(decoded).userId });
    if (user) {
      (req as any).user = decoded;
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }
    // console.log("decoded", Object(userId).userId);

    // console.log("userId")

    // Attach decoded user info to the request object for further use
  });
};
