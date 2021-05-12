import { db } from "../dbConfig";

export const find = (id?: string) => {
  const query = db("users");
  if (id) {
    query.where({ id }).first();
  }
  return query;
};

type User = {
  id: string;
  email: string;
  name: string;
  display_name: string;
};

export const add = async (user: User) => {
  const [id] = await db("users").insert(user, "id");
  return db("users").where({ id }).first();
};

export const remove = (id: string) => {
  return db("users").del().where({ id });
};

export const update = async (user: User) => {
  const { id } = user;
  await db("users")
    .where({ id })
    .update({ ...user });

  return db("users").where({ id }).first();
};
