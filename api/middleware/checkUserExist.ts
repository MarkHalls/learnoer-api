import { Request, Response, NextFunction } from "express";
import {
  findUserByEmailOrDisplayName,
  UserRecord,
} from "../../database/models/users";

export const checkUserAlreadyExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: UserRecord = req.body;
  try {
    const foundUser = await findUserByEmailOrDisplayName(user);

    const error: string[] = [];

    if (foundUser.email === user.email) {
      error.push("email");
    }
    if (foundUser.display_name === user.display_name) {
      error.push("display_name");
    }

    res.status(409).json({ error });
  } catch (err) {
    req.user = user;
    next();
  }
};
