import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthPayload, AuthRequest, UserRole } from "../types";
import { AppError } from "../utils/AppError";

export const protect = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Not authorized, no token", 401));
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission", 403));
    }
    next();
  };
};
