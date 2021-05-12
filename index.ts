import { makeServer, start } from "./api/server";

const server = makeServer();
start(server);
