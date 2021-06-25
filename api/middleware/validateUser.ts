import { Request, Response, NextFunction } from "express";

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.user = req.body;
  next();
};
