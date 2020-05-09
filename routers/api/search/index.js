const {
  textSearch,
  isbnSearch,
  isbnSearch2,
} = require("../../../clients/openLibraryApiClient");

module.exports = {
  name: "search",

  async register(server) {
    server.route({
      method: "GET",
      path: "/{isbn}",
      handler: async (req, h) => {
        //we need to make 2 api calls to get the availability of the book to read
        const { isbn } = req.params;

        return isbnSearch(isbn);
      },
    });

    server.route({
      method: "POST",
      path: "/",
      handler: async (req, h) => {
        return textSearch(req.payload.searchTerm);
      },
    });
  },
};
