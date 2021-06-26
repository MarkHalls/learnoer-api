import { Router } from "express";

import {
  getBooksByTitleOrIsbn,
  getBooksByOlid,
} from "../../../clients/openLibraryApiClient";

const router = Router();

router.get("/olid/:olid", async (req, res) => {
  const { olid } = req.params;
  const works = await getBooksByOlid(olid);
  res.status(200).json(works);
});

router.get("/:term", async (req, res) => {
  // http://localhost:3000/api/search/9781285741550
  const { term } = req.params;
  const works = await getBooksByTitleOrIsbn(term);
  res.status(200).json(works);
});

export default router;
