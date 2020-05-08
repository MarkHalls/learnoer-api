const qs = require("querystring");
const Wreck = require("@hapi/wreck");

const openLibClient = Wreck.defaults({
  baseUrl: "http://openlibrary.org/",
  json: true,
});

const openLibApiClient = openLibClient.defaults({
  baseUrl: "https://openlibrary.org/api/",
  json: true,
});

module.exports = {
  name: "search",

  async register(server) {
    server.route({
      method: "GET",
      path: "/{isbn}",
      handler: async (req, h) => {
        //we need to make 2 api calls to get the availability of the book to read
        const { isbn } = req.params;

        const isbnQuery = qs.stringify({
          format: "json",
          jscmd: "data",
          bibkeys: `ISBN:${isbn}`,
        });

        const { payload } = await openLibApiClient.get(`books?${isbnQuery}`);

        const isbnKey = `ISBN:${isbn}`;

        const titleQuery = qs.stringify({
          q: payload[isbnKey].title,
        });

        const books = await openLibClient.get(`search.json?${titleQuery}`);

        const foundBooks = books.payload.docs.filter(
          (book) => book.availability.status === "borrow_available"
        );

        return foundBooks;
      },
    });

    server.route({
      method: "POST",
      path: "/",
      handler: async (req, h) => {
        const searchString = qs.stringify({
          q: req.payload.searchTerm,
        });

        const searchResults = await openLibClient.get(
          `search.json?${searchString}`
        );

        const available = searchResults.data.docs.filter(
          (book) => book.availability.status === "borrow_available"
        );

        return {
          numFound: searchResults.data.numFound,
          filtered: available.length,
          available,
        };
      },
    });
  },
};
