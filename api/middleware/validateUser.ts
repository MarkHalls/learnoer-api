import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
};
