import { Request, Response } from "express";
import { OpenAIService, QueryService } from "@services";
import { ClientError } from "@exceptions";
import config from "@config";
import { EEmbeddingModel } from "@definitions/enums";
import logger from "@logger";
import { jsstr } from "@lib/utils";

const queryService = new QueryService();
const openaiService = new OpenAIService();

export const performEmbeddings = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { texts, modelname } = req.body as {
    texts: string[];
    modelname: EEmbeddingModel;
  };

  if (
    !texts?.length &&
    !modelname &&
    modelname !== EEmbeddingModel.TextEmbeddingAda
  ) {
    throw new ClientError(
      "Texts and model name is missing or invalid provided",
    );
  }

  const result = await openaiService.getEmbeddings(
    texts,
    EEmbeddingModel.TextEmbeddingAda,
  );

  // Send response with user data
  return res.status(200).json({
    data: { embeddings: result, dimensions: 1536 },
    success: true,
  });
};

export const getTextSearchResultFromQdrant = async (
  req: Request,
  res: Response,
) => {
  const { text, modelname, collectionName, limit, threshold } = req.body;
  const result = await queryService.embedGetSearchResults(
    text,
    EEmbeddingModel.TextEmbeddingAda,
    collectionName,
    limit,
  );

  logger.debug("Qdrant search result ", jsstr(result));

  const thresholdMatchingText = result?.reduce((acc, qres) => {
    if (qres.score >= threshold) acc += acc + qres.payload.text;
    return acc;
  }, "");

  return res.status(200).json({ data: thresholdMatchingText, success: true });
};

export const getAnswersFromOpenAI = async (req: Request, res: Response) => {
  const { texts, modelname } = req.body;

  if (modelname !== config.models["GPT3.5Turbo"].MODEL_NAME)
    throw new ClientError("Invalid model name: " + modelname);

  const result = await openaiService.getAnswer(texts, modelname);

  return res.status(200).json({ data: result, success: true });
};

export const splitTextIntoTokens = async (req: Request, res: Response) => {
  const { text, tokens } = req.body;
  const result = queryService.splitTextIntoChunks(text, tokens);
  return res.status(200).json({ data: result, success: true });
};

export const getTextTokenLength = async (req: Request, res: Response) => {
  const { text } = req.body;
  const result = queryService.getNumberOfTokens(text);
  return res.status(200).json({ data: result, success: true });
};
