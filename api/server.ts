import Hapi from "@hapi/hapi";

import { routes } from "../routers/api/index";

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
  await server.register(routes, {
    routes: { prefix: "/api" },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};
