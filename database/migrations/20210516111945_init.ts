import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("users", (users) => {
    users.text("id").primary();
    users.text("email").unique().notNullable();
    users.text("display_name").unique().notNullable();
    users.text("login_type").notNullable();
    users.text("profile_img");
  });

  await knex.schema.createTable("user_google", (gUsers) => {
    gUsers
      .text("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE")
      .primary();
    gUsers.text("openid").notNullable();
  });

  await knex.schema.createTable("user_internal", (iUsers) => {
    iUsers
      .text("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE")
      .primary();
    iUsers.text("password").notNullable();
  });

  await knex.schema.createTable("works", (works) => {
    works.text("id").primary();
    works.text("olid").notNullable();
  });

  await knex.schema.createTable("reviews", (reviews) => {
    reviews.text("id").primary();
    reviews
      .text("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    reviews
      .text("work_id")
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
    worksLists.text("id").primary();
    worksLists
      .text("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    worksLists.timestamp("public_since");
  });

  await knex.schema.createTable("works_lists_works", (worksListsWorks) => {
    worksListsWorks
      .text("works_list_id")
      .notNullable()
      .references("id")
      .inTable("works_lists")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    worksListsWorks
      .text("work_id")
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
      .text("work_id")
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
