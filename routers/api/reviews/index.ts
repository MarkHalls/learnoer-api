import { Server } from "@hapi/hapi";
import { v4 as uuidv4 } from "uuid";

import * as reviews from "../../../database/models/reviews";

export default {
  name: "reviews",

  async register(server: Server) {
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
          console.error(err);
        }
      },
    });
  },
};
