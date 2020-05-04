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

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello World!";
    },
  });

  return server;
};

const start = async (server) => {
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

module.exports = { makeServer, start };
