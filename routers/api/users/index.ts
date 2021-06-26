import { Router, Request, Response } from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

import { checkUserAlreadyExist } from "../../../api/middleware/checkUserExist";
import {
  allUsers,
  findUserById,
  addUser,
  removeUser,
} from "../../../database/models/users";
import { User } from "./domain/User";

type UserResource = {
  id: string;
  email: string;
  display_name: string;
  profile_img: string | null;
};

const UserResourceFromUser = (user: User): UserResource => {
  const userResource: UserResource = {
    id: user.id,
    email: user.email,
    display_name: user.display_name,
    profile_img: user.profile_img,
  };

  return userResource;
};

const signToken = (payload: { user: UserResource }) => {
  const secret: Secret = process.env.SECRET || "";

  return jwt.sign(payload, secret, {
    expiresIn: "1h",
  });
};

const router = Router();

router.get("/all", async (req: Request, res: Response) => {
  try {
    const users = await allUsers();
    const resource = users.map((user) => UserResourceFromUser(user));
    res.status(200).json(resource);
  } catch (err) {
    res.status(404).end();
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await findUserById(id);

  res.status(200).json(user);
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await removeUser(id);

    res.status(200).end();
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", checkUserAlreadyExist, async (req: Request, res: Response) => {
  try {
    req.user.id = nanoid();
    if (req.user.password) {
      req.user.password = bcrypt.hashSync(req.user.password, 10);
    }
    await addUser(req.user);
    const user = await findUserById(req.user.id);
    const resource = UserResourceFromUser(user);

    const token = signToken({ user: resource });

    res.status(201).json({ token, user: resource });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
