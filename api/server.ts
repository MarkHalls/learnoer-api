import express from "express";
import helmet from "helmet";
import cors from "cors";

import { logger } from "./middleware";

import routers from "../routers/api";

const server = express();

server.use(helmet());
server.use(cors());
server.use(logger);
server.use(express.json());
server.use("/api", routers);

export { server };
