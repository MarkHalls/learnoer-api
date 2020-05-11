// https://stackoverflow.com/a/57116514

const search = require("./search");

module.exports = {
  name: "api",

  async register(server) {
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
