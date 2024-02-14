// src/middleware/authentication.ts
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

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }

    // Attach decoded user info to the request object for further use
    (req as any).user = decoded;
    next();
  });
};
