const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const books = require("../../../database/models/books");

const openLibSearch = "http://openlibrary.org/search.json?q=";

module.exports = {
  name: "books",

  async register(server) {
    server.route({
      method: "GET",
      path: "/",
      handler: async (req, h) => {
        return "Da Books";
        // return books.find();
      },
    });
    server.route({
      method: "POST",
      path: "/",
      handler: async (req, h) => {
        const { isbn, title, author, publisher } = req.payload;

        const book = {
          id: uuidv4(),
          isbn,
          title,
          author,
          publisher,
        };

        try {
          const newBook = await books.add(book);
          return { newBook };
          console.log(newBook);
        } catch (err) {
          console.log(err);
        }
      },
    });
    server.route({
      method: "POST",
      path: "/search",
      handler: async (req, h) => {
        const searchResults = await axios.get(
          encodeURI(`${openLibSearch}${req.payload.searchTerm}`)
        );

        const available = searchResults.data.docs
          .map((book) => {
            if (book.availability.status !== "error") {
              return book;
            }
          })
          .filter((book) => book);
        return {
          numFound: searchResults.data.numFound,
          filtered: available.length,
          available,
        };
      },
    });
  },
};
