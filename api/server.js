const Hapi = require("@hapi/hapi");

process.on("unhandledrejection", (err) => {
  console.error(err);
  process.exit(1);
});

const makeServer = () => {
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host,
    routes: {
      cors: { origin: "ignore" },
      timeout: {
        server: 60000, //1 minute timeout
      },
    },
  });

  return server;
};

const start = async (server) => {
  //register all routes
  await server.register(require("../routers/api/index"), {
    routes: { prefix: "/api" },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

module.exports = { makeServer, start };
