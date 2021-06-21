import { db } from "../dbConfig";

export const allUsers = async (): Promise<UserRecord[]> => {
  return db("users")
    .leftJoin("user_google", { "users.id": "user_google.id" })
    .leftJoin("user_internal", { "users.id": "user_internal.id" });
};

export const findById = async (id: string): Promise<UserRecord> => {
  return db("users")
    .where({ id })
    .leftJoin("user_google", { "users.id": "user_google.id" })
    .leftJoin("user_internal", { "users.id": "user_internal.id" })
    .first();
};

type UserRecord = {
  id: string | null;
  email: string;
  name: string;
  display_name: string;
  login_type: string;
  open_id: string | null;
  password: string | null;
  profile_img: string | null;
};

export const add = async (user: UserRecord) => {
  const id = await db("users")
    .insert({
      display_name: user.display_name,
      email: user.email,
      login_type: user.login_type,
    })
    .returning("id")
    .first();

  if (user.open_id) {
    await db("user_google").insert({ user_id: id, openid: user.open_id });
  }

  if (user.password) {
    await db("user_internal").insert({
      user_id: id,
      password: user.password,
      profile_img: user.profile_img,
    });
  }
};

export const remove = async (id: string): Promise<Number> => {
  return db("users").where({ id }).del();
};

export const update = async (user: UserRecord): Promise<Number> => {
  return db("users")
    .where({ id: user.id })
    .update({ ...user });
};
