const db = require("../dbConfig");

const find = (id = undefined) => {
  const query = db("users");
  if (id) {
    query.where({ id }).first();
  }
  return query;
};

const add = async (user) => {
  const [id] = await db("users").insert(user, "id");
  return db("users").where({ id }).first();
};

const remove = (id) => {
  return db("users").del().where({ id });
};

const update = async (user) => {
  const { id } = user;
  await db("users")
    .where({ id })
    .update({ ...user });

  return db("users").where({ id }).first();
};

module.exports = {
  find,
  add,
  remove,
  update,
};
