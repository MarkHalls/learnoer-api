exports.up = function (knex) {
  return knex.schema.createTable("books", (books) => {
    books.uuid("id").primary();
    books.string("isbn", 64).notNullable().unique();
    books.text("author").notNullable();
    books.text("publisher");
    books.text("title").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("books");
};
