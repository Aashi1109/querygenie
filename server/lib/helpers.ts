import { getUUIDv4, jsstr, removeDataUriPrefix } from "@lib/utils";
import { Job } from "bullmq";
import logger from "@logger";
import config from "@config";
import {
  OpenAIService,
  ProjectService,
  QdrantService,
  QueryService,
  VectorService,
} from "@services";
import * as pdf from "pdf-parse";
import { EEmbeddingModel, EProcessingStages } from "@definitions/enums";

export const parserPdf = async (job: Job) => {
  logger.info(`Inside parserPdf ${jsstr(job.id)}`);
  const jobData = job.data;

  if (!jobData.file) throw Error("File not found");
  const cleanedBas64 = removeDataUriPrefix(jobData.file);
  const pdfBuffer = Buffer.from(cleanedBas64, "base64");
  const data = await getPdfInfo(pdfBuffer);

  logger.info(`Pdf data: ${jsstr(data)}`);
  if (data) {
    return data;
  } else {
    throw Error(`Failed to process file ${data}`);
  }
};

export const splitTextIntoTokens = async (text: string) => {
  try {
    // const request = await axios.post(
    //   config.embedQueryAPI.BASE_URL + config.embedQueryAPI.SPLIT_INTO_TOKENS,
    //   {
    //     encoding_model: config.models["GPT3.5Turbo"].MODEL_NAME,
    //     text: text,
    //     max_tokens: config.models["GPT3.5Turbo"].CHUNK_TOKEN_SIZE,
    //   },
    // );
    //
    // if (request.status !== 200) {
    //   throw new Error(
    //     "Error splitting text into tokens: " + jsstr(request.status),
    //   );
    // }
    // return request.data;
    const queryService = new QueryService();
    const textSplitResult = queryService.splitTextIntoChunks(
      text,
      config.models["GPT3.5Turbo"].CHUNK_TOKEN_SIZE,
    );
    return { success: true, texts: textSplitResult };
  } catch (e) {
    logger.error(`Error splitting text into tokens ${jsstr(e)}`, e);
    throw e;
  }
};
export const getEmbeddings = async (splittedTexts: string[]) => {
  try {
    // const request = await axios.post(
    //   config.embedQueryAPI.BASE_URL + config.embedQueryAPI.GET_EMBEDDINGS,
    //   { texts: splittedTexts, modelname: config.embeddingModel },
    // );
    //
    // if (request.status !== 200) {
    //   throw new Error("Error getting embeddings: " + jsstr(request.status));
    // }
    // return request.data;
    const openaiService = new OpenAIService();
    const result = await openaiService.getEmbeddings(
      splittedTexts,
      EEmbeddingModel.TextEmbeddingAda,
    );

    return { success: true, embeddings: result, dimensions: 1536 };
  } catch (e) {
    logger.error(`Error getting embeddings ${jsstr(e)}`);
    return { success: false };
  }
};

export const processFileJob = async (job: Job) => {
  logger.info(`Processing job for embedding purpose ${jsstr(job.id)}`, job);

  const jobData = job.data;

  let { info, metadata, text, projectId } = jobData ?? {
    text: null,
    metadata: null,
    info: null,
    projectId: null,
  };

  projectId = +projectId;

  if (text && projectId) {
    // call split token api to split the text into texts of that token size
    logger.debug(`Processing received text for projectID ${projectId}`);

    const splittedTextResp = await splitTextIntoTokens(text);
    logger.debug(`Splitted texts: ${jsstr(splittedTextResp)}`);
    if (splittedTextResp && splittedTextResp?.success) {
      // save embeddings to qdrant database
      const embeddingsData = await getEmbeddings(splittedTextResp.texts ?? []);
      logger.debug(`Embeddings data: ${jsstr(embeddingsData)}`);
      if (embeddingsData && embeddingsData?.success) {
        logger.debug(`After embedding process`);
        // using projectId check if there is collection created or not
        // if not create a collection
        // if collection exists then insert the embeddings to the collection
        const collectionDimensions: number = embeddingsData?.dimensions;

        const projectData = await ProjectService.getProjectsByFilter({
          id: projectId,
        });
        logger.debug(
          `Project retrieved for projectId ${projectId} -> ${jsstr(projectData)}`,
        );

        if (!projectData?.length)
          throw Error("Project not found with projectId ${projectId}");

        let insertCollectionId = getUUIDv4();
        const pData = projectData[0];
        const qdrantService = new QdrantService();

        if (!pData.collectionId) {
          logger.warn("Collection not present for project " + projectId);
          logger.info(
            `Creating collection with name ${insertCollectionId}, for project ${projectId}`,
          );

          const pCIdUpdateResult = await ProjectService.updateProject(
            projectId,
            pData.name,
            pData.description,
            pData.fileDataId,
            pData.processingStage,
            insertCollectionId,
          );

          logger.debug(`Project updated result: ${jsstr(pCIdUpdateResult)}`);

          const result = await qdrantService.createCollection(
            insertCollectionId,
            {
              size: collectionDimensions,
              distance: "Dot",
            },
          );

          if (result) {
            logger.info(
              `Collection created with name ${insertCollectionId}, for project ${projectId}`,
            );
          }
        } else {
          insertCollectionId = pData?.collectionId;
          logger.info(
            `Using existing collection with name ${insertCollectionId}, for project ${projectId}`,
          );
        }
        const chunkedTexts = splittedTextResp?.texts;
        const embeddings = embeddingsData.embeddings;
        const formattedPointsData = embeddings?.map(
          (embedding, index: number) => ({
            id: getUUIDv4(),
            vector: embedding,
            payload: {
              projectId: projectId,
              text: chunkedTexts[index],
            },
          }),
        );

        // save vectors to collection
        const result = await qdrantService.upsertPoints(
          insertCollectionId,
          formattedPointsData as any,
        );
        if (result?.status) {
          logger.info("Successfully saved points into collection %s", result);
          // save them in Vector database
          const vectorFormattedData = formattedPointsData.map(
            (data: { id: string }) => ({
              vectorId: data.id,
              projectId: +projectId,
            }),
          );
          const vectorCreationResult =
            await VectorService.createBulk(vectorFormattedData);
          logger.info(
            `Vector inserted into database ${jsstr(vectorCreationResult)}`,
          );
          // update project status to updated
          const projectUpdateResult = await ProjectService.updateProject(
            projectId,
            pData.name,
            pData.description,
            pData.fileDataId,
            EProcessingStages.Completed,
          );
          logger.debug(`Project updated result: ${jsstr(projectUpdateResult)}`);
          return { vectorCount: vectorCreationResult.count };
        }
      }
    }
  } else {
    logger.error("No text or projectId found in job data");

    return Error("No text or projectId found in job data");
  }

  return Error("Failed to process job data");
};

export const getPdfInfo = async (pdfBuffer: Buffer) => {
  logger.info("Reading PDF from buffer");
  const data = await pdf(pdfBuffer);

  if (data) {
    const { info, metadata, text } = data;
    return { info: info, metadata: metadata, text: text };
  } else return null;
};
