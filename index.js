const { makeServer, start } = require("./api/server");

const server = makeServer();
start(server);
