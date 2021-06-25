import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} on ${req.originalUrl} at ${new Date(Date.now())}`);
  next();
};
