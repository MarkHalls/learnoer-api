import { Server } from "@hapi/hapi";

import {
  search,
  searchByOlid,
  extractBookData,
} from "../../../clients/openLibraryApiClient";

export default {
  name: "search",

  async register(server: Server) {
    server.route({
      method: "GET",
      path: "/olid/{olid}",
      handler: async (req, h) => {
        const { olid } = req.params;

        const foundBook = await searchByOlid(olid);

        return extractBookData(foundBook);
      },
    });

    server.route({
      method: "GET",
      path: "/{term}",
      handler: (req, h) => {
        // http://localhost:3000/api/search/9781285741550

        const { term } = req.params;
        return search(term);
      },
    });
  },
};
