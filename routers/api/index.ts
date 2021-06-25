import { Router } from "express";

import searchRouter from "./search";
import userRouter from "./users";

const router = Router();

router.use("/search", searchRouter);
router.use("/user", userRouter);
router.get("/", (_, res) => res.status(200).json({ body: "Hello World" }));

export default router;
