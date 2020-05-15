const {
  searchByTitle,
  searchByIsbn,
  filterAvailableBooks,
  searchByOlid,
} = require("../../../clients/openLibraryApiClient");

module.exports = {
  name: "search",

  async register(server) {
    server.route({
      method: "GET",
      path: "/olid/{olid}",
      handler: async (req, h) => {
        const { olid } = req.params;

        const foundBook = await searchByOlid(olid);

        return filterAvailableBooks(foundBook);
      },
    });

    server.route({
      method: "GET",
      path: "/{term}",
      handler: async (req, h) => {
        // http://localhost:3000/api/search/9781285741550

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

          return foundBooks;
        } catch (err) {
          console.error(err);
        }
      },
    });
  },
};
