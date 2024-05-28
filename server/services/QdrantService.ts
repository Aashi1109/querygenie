import { QdrantClient } from "@qdrant/js-client-rest";
import logger from "@logger";
import { jsstr } from "@lib/utils";

interface QdrantCollectionOptions {
  size: number;
  distance: "Cosine" | "Dot" | "Euclid" | "Manhattan";
}

interface QdrantPointsUpsert {
  id: string;
  payload:
    | Record<string, unknown>
    | {
        [key: string]: unknown;
      };
  vector:
    | number[]
    | {
        [key: string]:
          | number[]
          | {
              indices: number[];
              values: number[];
            };
      };
}

class QdrantService {
  private qdrantClient: QdrantClient;

  constructor() {
    this.qdrantClient = new QdrantClient({ url: "http://localhost:6333" });
  }

  async getAllCollections() {
    try {
      const result = await this.qdrantClient.getCollections();
      logger.debug("Available collections %s", result);
    } catch (e) {
      logger.error("Error getting collections ", e);
      throw e;
    }
  }

  async getCollection(name: string) {
    try {
      const result = await this.qdrantClient.getCollection(name);
      logger.debug("Collection found %s", result);
      return result;
    } catch (e) {
      logger.error("Error getting collection ", e);
    }
  }

  async createCollection(name: string, options: QdrantCollectionOptions) {
    try {
      const result = await this.qdrantClient.createCollection(name, {
        vectors: { ...options },
      });
      logger.debug("Collection created %s", result);
      return result;
    } catch (e) {
      logger.error("Error creating collection ", e);
      throw e;
    }
  }

  async upsertPoints(collection: string, points: QdrantPointsUpsert[]) {
    try {
      return await this.qdrantClient.upsert(collection, { points });
    } catch (e) {
      logger.error("Error inserting points in collection ", e);
      throw e;
    }
  }

  async searchPoints(collection: string, vector: any, limit: number) {
    try {
      const searchResults = await this.qdrantClient.search(collection, {
        params: {
          hnsw_ef: 128,
          exact: false,
        },
        vector: vector,
        limit: limit,
      });

      logger.info("Search results: %s", jsstr(searchResults));
      return searchResults;
    } catch (error) {
      logger.error("Error during search:", error);
      throw error;
    }
  }
}

export default QdrantService;
