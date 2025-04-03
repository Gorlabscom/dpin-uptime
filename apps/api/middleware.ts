import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "./config";

// Add type declaration for Request
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_PUBLIC_KEY);

    console.log("decoded: ", decoded);

    if (!decoded || typeof decoded !== "object" || !decoded.sub) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    req.userId = decoded.sub as string;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
}
