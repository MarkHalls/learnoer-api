import { db } from "../dbConfig";

export const allUsers = async (): Promise<UserRecord[]> => {
  return db("users")
    .leftJoin("user_google", { "users.id": "user_google.user_id" })
    .leftJoin("user_internal", { "users.id": "user_internal.user_id" });
};

export const findUserById = async (id: string): Promise<UserRecord> => {
  return db("users")
    .where({ id })
    .leftJoin("user_google", { "users.id": "user_google.user_id" })
    .leftJoin("user_internal", { "users.id": "user_internal.user_id" })
    .first();
};

export type UserRecord = {
  id: string | null;
  email: string;
  name: string;
  display_name: string;
  login_type: string;
  open_id: string | null;
  password: string | null;
  profile_img: string | null;
};

export const addUser = async (user: UserRecord) => {
  console.log(user);

  await db("users")
    .insert({
      id: user.id,
      display_name: user.display_name,
      email: user.email,
      login_type: user.login_type,
    })
    .returning("id");

  if (user.open_id) {
    await db("user_google").insert({
      user_id: user.id,
      openid: user.open_id,
    });
  }

  if (user.password) {
    await db("user_internal").insert({
      user_id: user.id,
      password: user.password,
      profile_img: user.profile_img,
    });
  }
};

export const removeUser = async (id: string): Promise<Number> => {
  return db("users").where({ id }).del();
};

export const updateUser = async (user: UserRecord): Promise<Number> => {
  return db("users")
    .where({ id: user.id })
    .update({ ...user });
};
