import { config as dotenvConfig } from "dotenv";
import { Config } from "knex";

dotenvConfig();

const config: Config = {
  client: process.env.DB_CLIENT,
  migrations: {
    directory: "./database/migrations",
  },
  seeds: {
    directory: "./database/seeds",
  },
};

if (process.env.DB_DEFAULT_NULL) {
  config.useNullAsDefault = true;
}

if (process.env.DB_URL) {
  config.connection = {
    host: process.env.DB_URL,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };
}

module.exports = config;
