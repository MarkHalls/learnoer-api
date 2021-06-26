import { Credentials, User } from "../../routers/api/users/domain/User";
import { db } from "../dbConfig";

export type UserRecord = {
  id: string;
  email: string;
  display_name: string;
  login_type: "google" | "internal";
  openid: string | null;
  password: string | null;
  profile_img: string | null;
};

const isUserRecord = (userRecord: any): userRecord is UserRecord => {
  if (typeof userRecord !== "object" || userRecord === null) {
    return false;
  }

  const nullableKeys = ["id", "openid", "password", "profile_img"];
  const notNullableKeys = ["email", "display_name", "login_type"];

  if (
    !nullableKeys.every(
      (key) => typeof userRecord[key] === "string" || userRecord[key] === null
    )
  ) {
    return false;
  }

  if (!notNullableKeys.every((key) => typeof userRecord[key] === "string")) {
    return false;
  }
  return true;
};

const userFromRecord = (userRecord: UserRecord): User => {
  const credentials: Credentials =
    userRecord.login_type === "google"
      ? {
          kind: userRecord.login_type,
          openid: userRecord.openid as string,
        }
      : {
          kind: userRecord.login_type,
          password: userRecord.password as string,
        };

  const user: User = {
    id: userRecord.id,
    email: userRecord.email,
    display_name: userRecord.display_name,
    credentials,
    profile_img: userRecord.profile_img,
  };

  return user;
};

const userRecordFromUser = (user: User): UserRecord => {
  const openId =
    user.credentials.kind === "google" ? user.credentials.openid : null;
  const password =
    user.credentials.kind === "internal" ? user.credentials.password : null;

  const userRecord = {
    id: user.id ?? null,
    email: user.email,
    display_name: user.display_name,
    login_type: user.credentials.kind,
    openid: openId,
    password,
    profile_img: user.profile_img ?? null,
  };

  return userRecord;
};
const expectUserRecord = (userRecord: unknown): void => {
  if (!isUserRecord(userRecord)) {
    throw new Error("Value is not a valid UserRecord");
  }
};

export const allUsers = async (): Promise<UserRecord[]> => {
  const userRecord = await db("users")
    .leftJoin("user_google", { "users.id": "user_google.user_id" })
    .leftJoin("user_internal", { "users.id": "user_internal.user_id" });
  expectUserRecord(userRecord);
  return userRecord;
};

export const findUserById = async (id: string): Promise<User> => {
  const userRecord = await db("users")
    .where({ id })
    .leftJoin("user_google", { "users.id": "user_google.user_id" })
    .leftJoin("user_internal", { "users.id": "user_internal.user_id" })
    .first();
  expectUserRecord(userRecord);
  return userFromRecord(userRecord);
};

export const findUserByEmailOrDisplayName = async (
  user: UserRecord
): Promise<UserRecord> => {
  const userRecord = await db("users")
    .where({ email: user.email })
    .orWhere({ display_name: user.display_name })
    .leftJoin("user_google", { "users.id": "user_google.user_id" })
    .leftJoin("user_internal", { "users.id": "user_internal.user_id" })
    .first();
  expectUserRecord(userRecord);
  return userRecord;
};

export const findUserByEmail = async (email: string): Promise<UserRecord> => {
  const userRecord = await db("users")
    .where({ email })
    .leftJoin("user_google", { "users.id": "user_google.user_id" })
    .leftJoin("user_internal", { "users.id": "user_internal.user_id" })
    .first();
  expectUserRecord(userRecord);
  return userRecord;
};

export const addUser = async (user: UserRecord) => {
  await db("users")
    .insert({
      id: user.id,
      display_name: user.display_name,
      email: user.email,
      login_type: user.login_type,
      profile_img: user.profile_img,
    })
    .returning("id");

  if (user.openid) {
    await db("user_google").insert({
      user_id: user.id,
      openid: user.openid,
    });
  }

  if (user.password) {
    await db("user_internal").insert({
      user_id: user.id,
      password: user.password,
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
