const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const reviews = require("../../../database/models/reviews");

const openLibSearch = "http://openlibrary.org/search.json?q=";

module.exports = {
  name: "reviews",

  async register(server) {
    server.route({
      method: "GET",
      path: "/{key}",
      handler: async (req, h) => {},
    });

    server.route({
      method: "POST",
      path: "/",
      handler: async (req, h) => {
        const { key, userId, body } = req.payload;

        const book = {
          id: uuidv4(),
          key,
          user_id: userId,
          body,
        };

        try {
          const newBook = await reviews.add(book);
          return { newBook };
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
};
