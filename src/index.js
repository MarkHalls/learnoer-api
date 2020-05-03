import { makeServer, start } from "./api/server.js";

const server = makeServer();
start(server);
