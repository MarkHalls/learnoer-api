import { db } from "../dbConfig";

export const find = (id = undefined) => {
  const query = db("reviews");
  if (id) {
    query.where({ id }).first();
  }
  return query;
};

type Review = {
  id: string;
  openlibrary_work: string;
  user_id: string;
  display_name: string;
  body: string;
};

export const add = async (review: Review) => {
  const [id] = await db("reviews").insert(review, "id");
  return db("reviews").where({ id }).first();
};

export const remove = (id: string) => {
  return db("reviews").del().where({ id });
};

export const update = async (review: Review) => {
  const { id } = review;
  await db("reviews")
    .where({ id })
    .update({ ...review });

  return db("reviews").where({ id }).first();
};
