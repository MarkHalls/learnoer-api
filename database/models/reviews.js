const db = require("../dbConfig");

const find = (id = undefined) => {
  const query = db("reviews");
  if (id) {
    query.where({ id }).first();
  }
  return query;
};

const add = async (review) => {
  const [id] = await db("reviews").insert(review, "id");
  return db("reviews").where({ id }).first();
};

const remove = (id) => {
  return db("reviews").del().where({ id });
};

const update = async (review) => {
  const { id } = review;
  await db("reviews")
    .where({ id })
    .update({ ...review });

  return db("reviews").where({ id }).first();
};

module.exports = {
  find,
  add,
  remove,
  update,
};
