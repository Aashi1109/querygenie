const config = {
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  apiUrl: process.env.API_URL || "",
  storageType: "Cloudinary",
  embeddingModel: "text-embedding-ada-002",
  embeddingUrl: process.env.EMBED_QUERY_URL || "",
};

export const PROMPT_DELIMITER = "#@#";

export const QDRANT_SEARCH_LIMIT = 10;
export const QDRANT_MATCH_THRESHOLD = 0.85;

export const QUERY_MODEL_NAME = "gpt-3.5-turbo";

export const SYSTEM_PROMPT =
  "You are an intelligent assistant. You will receive a piece of context. Your task is to help users find answers based only on this context. Strictly respond only to questions that can be answered with the given context. Do not answer questions outside this context in any way. Strictly never mention 'context' in your responses in any way. Provide all answers in markdown format. \\n\\nHere is the context: #@#";

export const prompt = [
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },
  {
    role: "user",
    content: "provide summary in list",
  },
];

export default config;
