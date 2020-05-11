require("dotenv").config();

const config = {
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
  config.connection = process.env.DB_URL;
}

if (process.env.DB_CLIENT === "sqlite") {
  config.connection = {
    filename: "./database/data.db3",
  };
  config.pool = {
    afterCreate: (conn, done) => {
      conn.run("PRAGMA foreign_keys = ON", done);
    },
  };
}

// use for sqlite
if (process.env.DB_SUPPRESS_LOGS) {
  config.log = {
    warn(message) {},
    error(message) {},
    deprecate(message) {},
    debug(message) {},
  };
}

module.exports = config;
