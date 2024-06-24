import * as dotenv from "dotenv";
import * as process from "node:process";

dotenv.config({ path: __dirname + "/.env" });

const config = {
  port: process.env.PORT || 5000,
  hostname: process.env.HOSTNAME || "localhost",
  corsOptions: {
    origin: process.env.CORS_ORIGIN.split(","),
    optionsSuccessStatus: 200,
  },
  dbUrl: process.env.DATABASE_URL || "",
  express: {
    fileSizeLimit: "20mb",
  },
  morganLogFormat: "dev",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    folderPath: "QueryGenieAPI",
  },
  apiPrefixes: {
    user: "/api/users",
    project: "/api/projects",
    vector: "/api/vectors",
    file: "/api/files",
    chat: "/api/chats",
    message: "/api/messages",
    query: "/api/query",
  },
  bullMQ: {
    queues: {
      fileProcessing: "BullMQ__FileProcessing",
      pdfParing: "BullMQ__PDFParsing",
    },
    removeOnComplete: true,
    removeOnFail: {
      age: 24 * 3600,
    },
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: +process.env.REDIS_PORT || 6379,
  },
  models: {
    "GPT3.5Turbo": {
      MAX_TOKENS: +process.env.MODEL_MAX_TOKENS,
      MAX_ANSWER_TOKENS: 1000,
      CHUNK_TOKEN_SIZE: +process.env.CHUNK_TOKEN_SIZE,
      MODEL_NAME: "gpt-3.5-turbo",
    },
  },
  embedQueryAPI: {
    BASE_URL: process.env.EMBED_QUERY_URL,
    SPLIT_INTO_TOKENS: "/token_split",
    GET_EMBEDDINGS: "/embedding",
  },
  embeddingModel: "GTE-Large",
  OPEN_API_KEY: process.env.OPEN_API_KEY,
  LOG_DIR: process.env.LOG_DIR || "./logs/",
  QDRANT: {
    host: process.env.QDRANT_HOST || "localhost",
    port: +process.env.QDRANT_PORT || 6333,
  },
};

export default config;
