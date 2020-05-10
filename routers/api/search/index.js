const {
  searchByTitle,
  searchByIsbn,
  filterAvailableBooks,
} = require("../../../clients/openLibraryApiClient");

module.exports = {
  name: "search",

  async register(server) {
    server.route({
      method: "GET",
      path: "/{term}",
      handler: async (req, h) => {
        //TODO limit requests to 4094 characters

        try {
          const { term } = req.params;

          const foundBooks = await searchByIsbn([term]);

          if (foundBooks.length === 0) {
            //assume the path was actually a title
            const books = await searchByTitle(term);
            return filterAvailableBooks(books);
          }

          const availableBooks = filterAvailableBooks(foundBooks);

          if (availableBooks.length === 0) {
            const relatedBooks = await searchByTitle(foundBooks[0].data.title);

            return filterAvailableBooks(relatedBooks);
          }

          return searchByIsbn([term]);
        } catch (err) {
          console.error(err);
          console.error(err.data.payload.toString());
          console.error(err.data.res.req);
        }
      },
    });
  },
};
