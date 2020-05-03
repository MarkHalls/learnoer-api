import { makeServer, start, router } from "./api/server.js";

const server = makeServer();
router(server);
start(server);
