exports.up = function (knex) {
  return knex.schema.createTable("reviews", (reviews) => {
    reviews.string("id", 36).primary();
    reviews
      .uuid("book_id")
      .notNullable()
      .references("id")
      .inTable("books")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    reviews
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    reviews.text("display_name").unique();
    reviews.unique(["book_id", "user_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("reviews");
};
