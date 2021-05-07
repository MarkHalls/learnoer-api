import * as Hapi from "@hapi/hapi";

process.on("unhandledrejection", (err) => {
  console.error(err);
  process.exit(1);
});

export const makeServer = () => {
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host,
    routes: {
      cors: { origin: "ignore" },
    },
  });

  return server;
};

export const start = async (server: Hapi.Server) => {
  //register all routes
  await server.register(require("../routers/api/index"), {
    routes: { prefix: "/api" },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};