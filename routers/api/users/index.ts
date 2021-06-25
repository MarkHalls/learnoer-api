import { Router, Request, Response } from "express";
import { nanoid } from "nanoid";

import { validateUser } from "../../../api/middleware";
import {
  allUsers,
  findUserById,
  addUser,
  removeUser,
} from "../../../database/models/users";

const router = Router();

router.get("/all", async (req: Request, res: Response) => {
  const users = await allUsers();

  res.status(200).json(users);
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

router.post("/", validateUser, async (req: Request, res: Response) => {
  try {
    req.user.id = nanoid();
    await addUser(req.user);

    res.status(201).end();
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
