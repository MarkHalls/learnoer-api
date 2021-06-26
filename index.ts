import { server } from "./api/server";

const port = process.env.PORT || 3000;

server.listen(port, () =>
  console.log(`\n **Server listening on port ${port}** \n`)
);
