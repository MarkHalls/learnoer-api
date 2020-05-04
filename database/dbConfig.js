import * as knex from "knex";

import * as knexConfig from "../knexfile.js";

console.log(process.env.DB_ENV);

const environment = process.env.DB_ENV || "development";

module.exports = knex(knexConfig[environment]);
