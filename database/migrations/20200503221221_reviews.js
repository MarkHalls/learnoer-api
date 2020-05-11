exports.up = function (knex) {
  return knex.schema.createTable("reviews", (reviews) => {
    reviews.string("id", 36).primary();
    reviews.string("openlibrary_work", 256).notNullable();
    reviews
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    reviews.text("display_name").unique();
    reviews.unique(["openlibrary_work", "user_id"]);
    reviews.text("body");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("reviews");
};
