const db = require("../dbConfig");

const find = (id = undefined) => {
  const query = db("books");
  if (id) {
    query.where({ id }).first();
  }
  return query;
};

const add = async (book) => {
  const [id] = await db("books").insert(book, "id");
  return db("books").where({ id }).first();
};

const remove = (id) => {
  return db("books").del().where({ id });
};

const update = async (book) => {
  const { id } = book;
  await db("books")
    .where({ id })
    .update({ ...book });

  return db("books").where({ id }).first();
};

module.exports = {
  find,
  add,
  remove,
  update,
};
