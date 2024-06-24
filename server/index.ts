import * as cors from "cors";
import * as express from "express";

import * as morgan from "morgan";
import config from "@config";
import { errorHandler } from "@middlewares/errorHandler";
import {
  chatsRouter,
  fileRouter,
  messagesRouter,
  projectRouter,
  queryRouter,
  userRouter,
  vectorRouter,
} from "@routes";
import prismaErrorHandler from "@middlewares/prismaErrorHandler";
// bullmq dashboard config
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { ExpressAdapter } from "@bull-board/express";
import { fileProcessingQueue, pdfParserQueue } from "@bmq";
import * as fs from "fs";
import * as path from "node:path";
import logger from "@logger";

const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [
    new BullMQAdapter(fileProcessingQueue),
    new BullMQAdapter(pdfParserQueue),
  ],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath("/admin");

const app = express();

// cors setup to allow requests from the frontend only for now
app.use(cors(config.corsOptions));

// parse requests of content-type - application/json
app.use(express.json({ limit: config.express.fileSizeLimit }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
    limit: config.express.fileSizeLimit,
  }),
);

// write morgan logs to file
app.use(
  morgan("common", {
    stream: fs.createWriteStream(path.join(config.LOG_DIR, "access.log"), {
      flags: "a",
    }),
  }),
);

// logging request routes
app.use(morgan(config.morganLogFormat));

// add bullmq dashboard
app.use("/admin", serverAdapter.getRouter());

// route to log basic information for the application
app.get("/", (_, res) => {
  return res.status(200).type("json").send({
    name: "QueryGenie API",
    description: "QueryGenie backend service",
    version: "1.0.0",
  });
});

// add routes
app.use(config.apiPrefixes.user, userRouter);
app.use(config.apiPrefixes.vector, vectorRouter);
app.use(config.apiPrefixes.project, projectRouter);
app.use(config.apiPrefixes.file, fileRouter);
app.use(config.apiPrefixes.chat, chatsRouter);
app.use(config.apiPrefixes.message, messagesRouter);
app.use(config.apiPrefixes.query, queryRouter);

// route to handle unknown request paths
app.use("*", (_, res) => {
  res.status(404).json({ message: "Requested url not found Not found" });
});

// adding handler to handle prisma errors
app.use(prismaErrorHandler);

// adding errorHandler as last middleware to handle all error
// add this before app.listen
app.use(errorHandler);

app.listen(+config.port, config.hostname, async () => {
  logger.info(`⚡ Server running on ${config.port}`);
  // await connectDB();
});
