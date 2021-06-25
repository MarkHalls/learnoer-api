import knex from "knex";
import config = require("../knexfile");

export const db = knex(config);
