import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("users", (users) => {
    users.uuid("id").primary();
    users.text("email").notNullable();
    users.text("display_name").notNullable();
    users.text("login_type").notNullable();
  });

  await knex.schema.createTable("user_google", (users) => {
    users
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE")
      .primary();
    users.text("openid").notNullable();
  });

  await knex.schema.createTable("user_internal", (users) => {
    users
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE")
      .primary();
    users.text("password").notNullable();
    users.text("profile_img");
  });

  await knex.schema.createTable("works", (users) => {
    users.uuid("id").primary();
    users.text("olid").notNullable();
  });

  await knex.schema.createTable("reviews", (reviews) => {
    reviews.uuid("id").primary();
    reviews
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    reviews
      .uuid("work_id")
      .notNullable()
      .references("id")
      .inTable("works")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    reviews.integer("rating").defaultTo(0).notNullable();
    reviews.text("subject");
    reviews.text("body").notNullable();
    reviews.unique(["user_id", "work_id"]);
  });

  await knex.schema.createTable("works_lists", (worksLists) => {
    worksLists.uuid("id").primary();
    worksLists
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    worksLists.timestamp("public_since");
  });

  await knex.schema.createTable("works_lists_works", (worksListsWorks) => {
    worksListsWorks
      .uuid("works_list_id")
      .notNullable()
      .references("id")
      .inTable("works_lists")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    worksListsWorks
      .uuid("work_id")
      .notNullable()
      .references("id")
      .inTable("works")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    worksListsWorks.integer("bookmark");
    worksListsWorks.primary(["works_list_id", "work_id"]);
  });

  await knex.schema.createTable("works_tags", (worksTags) => {
    worksTags
      .uuid("work_id")
      .notNullable()
      .references("id")
      .inTable("works")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    worksTags.text("name");
    worksTags.primary(["work_id", "name"]);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists("works_tags");
  await knex.schema.dropTableIfExists("works_lists_works");
  await knex.schema.dropTableIfExists("works_lists");
  await knex.schema.dropTableIfExists("reviews");
  await knex.schema.dropTableIfExists("works");
  await knex.schema.dropTableIfExists("user_internal");
  await knex.schema.dropTableIfExists("user_google");
  await knex.schema.dropTableIfExists("users");
}
