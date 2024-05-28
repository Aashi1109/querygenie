import config from "@config";
import { OpenAIService, QdrantService } from "@services/index";
import { getEncoding } from "js-tiktoken";

class QueryService {
  async getEmbeddings(texts: string[], modelname: string) {
    const url =
      config.embedQueryAPI.BASE_URL + config.embedQueryAPI.GET_EMBEDDINGS;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texts: texts,
        modelname: modelname,
      }),
    });
    return await response.json();
  }

  async getQdrantSearchResults(
    collectionName: string,
    embeddings: number[],
    limit: number,
  ) {
    const qdrantService = new QdrantService();
    return await qdrantService.searchPoints(collectionName, embeddings, limit);
  }

  async embedGetSearchResults(
    text: string,
    modelname: string,
    collectionName: string,
    limit: number,
  ) {
    const openaiService = new OpenAIService();
    const embeddings = await openaiService.getEmbeddings([text], modelname);

    if (embeddings?.length) {
      return await this.getQdrantSearchResults(
        collectionName,
        embeddings?.length ? (embeddings[0] as unknown as number[]) : [],
        limit,
      );
    }
  }

  /**
   * Splits a long text into chunks of specified token length.
   * @param {string} text - The long text to be split.
   * @param {number} tokenLength - The maximum token length for each chunk.
   * @returns {string[]} - An array of text chunks.
   */
  splitTextIntoChunks(text: string, tokenLength: number): string[] {
    // Initialize the encoding method
    const encoding = getEncoding("cl100k_base");
    // Encode the text into tokens
    const tokens = encoding.encode(text);
    const chunks = [];
    let currentIndex = 0;

    while (currentIndex < tokens.length) {
      // Get the current chunk of tokens
      const tokenChunk = tokens.slice(currentIndex, currentIndex + tokenLength);
      // Decode the token chunk back to text
      const textChunk = encoding.decode(tokenChunk);
      chunks.push(textChunk);
      currentIndex += tokenLength;
    }

    return chunks;
  }

  /**
   * Gets the number of tokens in a given text.
   * @param {string} text - The text to be tokenized.
   * @returns {number} - The number of tokens in the text.
   */
  getNumberOfTokens(text: string): number {
    // Initialize the encoding method
    const encoding = getEncoding("cl100k_base");
    // Encode the text into tokens
    const tokens = encoding.encode(text);
    // Return the number of tokens
    return tokens.length;
  }
}

export default QueryService;
