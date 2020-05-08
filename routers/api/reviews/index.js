const { v4: uuidv4 } = require("uuid");

const reviews = require("../../../database/models/reviews");

module.exports = {
  name: "reviews",

  async register(server) {
    server.route({
      method: "GET",
      path: "/{openlibrary_work}",
      handler: async (req, h) => {},
    });

    server.route({
      method: "POST",
      path: "/",
      handler: async (req, h) => {
        const { key, userId, body } = req.payload;

        const book = {
          id: uuidv4(),
          openlibrary_work,
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
