const Hapi = require("@hapi/hapi");

process.on("unhandledrejection", (err) => {
  console.error(err);
  process.exit(1);
});

const makeServer = () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
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
