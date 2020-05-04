exports.up = function (knex) {
  return knex.schema.createTable("users", (users) => {
    users.string("id", 36).primary();
    users.text("email").notNullable();
    users.text("name").notNullable();
    users.text("display_name").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
