const {
  textSearch,
  searchByIsbn,
  filterAvailableBooks,
} = require("../../../clients/openLibraryApiClient");

module.exports = {
  name: "search",

  async register(server) {
    server.route({
      method: "GET",
      path: "/{isbn}",
      handler: async (req, h) => {
        const { isbn } = req.params;

        const foundBooks = await searchByIsbn([isbn]);

        if (foundBooks.length === 0) {
          return [];
        }
        const availableBooks = filterAvailableBooks(foundBooks);

        if (availableBooks.length === 0) {
          const relatedBooks = await textSearch(foundBooks[0].data.title);

          return filterAvailableBooks(relatedBooks);
        }

        return searchByIsbn([isbn]);
      },
    });

    server.route({
      method: "POST",
      path: "/",
      handler: async (req, h) => {
        const availableBooks = await textSearch(req.payload.searchTerm);
        return filterAvailableBooks(availableBooks);
      },
    });
  },
};
