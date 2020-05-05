module.exports = {
  name: "books",

  async register(server) {
    server.route({
      method: "GET",
      path: "/",
      handler: async (req, h) => {
        return "Dis is da books";
      },
    });
  },
};
