import config from "@config";
import { Job, Queue, Worker } from "bullmq";
import logger from "@logger";
import { parserPdf, processFileJob } from "@lib/helpers";
import { jsstr } from "@lib/utils";
import { ProjectService } from "@services";
import { EProcessingStages } from "@definitions/enums";

const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
};

export const redisOptions = {
  host: config.redis.host,
  port: config.redis.port,
};

export const fileProcessingQueue = new Queue(
  config.bullMQ.queues.fileProcessing,
  { connection: redisOptions, defaultJobOptions }
);

export const fileProcessingWorker = new Worker(
  config.bullMQ.queues.fileProcessing,
  processFileJob,
  { autorun: true, connection: redisOptions }
);

export const pdfParserQueue = new Queue(config.bullMQ.queues.pdfParing, {
  connection: redisOptions,
  defaultJobOptions,
});

const pdfParserWorker = new Worker(config.bullMQ.queues.pdfParing, parserPdf, {
  connection: redisOptions,
});

pdfParserWorker.on("failed", (job, returnValue) => {
  logger.error(`PDF Parser failed ${jsstr(job.id)} ${jsstr(returnValue)}`);
});

pdfParserWorker.on("error", (error) => {
  logger.error(`PDF Parser failed with error ${jsstr(error)}`);
});

pdfParserWorker.on("completed", async (job: Job, returnValue) => {
  logger.info(`PDF Parser finished ${jsstr(job.id)} ${jsstr(returnValue)}`);
  logger.debug("Sending to pdf processing worker");

  // assigning the returned value as data to new worker
  // job.data = { ...returnValue, projectId: job.data?.projectId };
  const newJobData = { ...returnValue, projectId: job.data?.projectId };
  await fileProcessingQueue.add(job.name + "__PDFEmbed", newJobData, {
    removeOnFail: false,
    removeOnComplete: true,
  });

  // remove the job from the queue if possible
  // logger.debug(`Removing job ${jsstr(job)} from pdfParserWorker`);
  // await job.remove();
});
fileProcessingWorker.on("error", async (error) => {
  logger.error(`File Processing worker failed with error ${jsstr(error)}`);
  // set status of project to failed
});

fileProcessingWorker.on("failed", async (job: Job, returnValue) => {
  logger.error(`File Processing failed ${jsstr(job)} ${jsstr(returnValue)}`);
  // set status of project to failed
  const projectId = +job.data?.projectId;

  if (!projectId) return;

  const projectUpdateResult = await ProjectService.updateProject(
    projectId,
    undefined,
    undefined,
    undefined,
    EProcessingStages.Completed
  );
});

fileProcessingWorker.on("completed", async (job, returnValue) => {
  logger.info(
    `File Processing finished  ${jsstr(job.id)} ${jsstr(returnValue)}`
  );
});
