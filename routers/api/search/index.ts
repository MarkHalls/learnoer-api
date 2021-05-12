import { Server } from "@hapi/hapi";

import {
  getBooksByTitleOrIsbn,
  getBooksByOlid,
} from "../../../clients/openLibraryApiClient";

export default {
  name: "search",

  async register(server: Server) {
    server.route({
      method: "GET",
      path: "/olid/{olid}",
      handler: async (req, h) => {
        const { olid } = req.params;

        return getBooksByOlid(olid);
      },
    });

    server.route({
      method: "GET",
      path: "/{term}",
      handler: (req, h) => {
        // http://localhost:3000/api/search/9781285741550

        const { term } = req.params;
        return getBooksByTitleOrIsbn(term);
      },
    });
  },
};
