// https://stackoverflow.com/a/57116514

import { Server } from "hapi";

const search = require("./search");

export default {
  name: "api",

  async register(server: Server) {
    server.route([
      {
        method: "GET",
        path: "/",
        handler: async (req, h) => {
          return "Hello World";
        },
      },
      {
        method: "*",
        path: "/{p*}",
        handler: (req, h) => {
          return "Hello my baby, hello my honey";
        },
      },
    ]);

    server.register(search, { routes: { prefix: "/search" } });
  },
};
