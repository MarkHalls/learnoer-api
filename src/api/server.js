import Hapi from "@hapi/hapi";

process.on("unhandledrejection", (err) => {
  console.error(err);
  process.exit(1);
});

const makeServer = () =>
  Hapi.server({
    port: 3000,
    host: "localhost",
  });

const start = async (server) => {
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

export { makeServer, start };
