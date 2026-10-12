import { Worker } from "bullmq";
import { SUBMISSION_QUEUE } from "../utils/constants.utils";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";

async function setupEvaluationWorker() {
  const worker = new Worker(SUBMISSION_QUEUE, async (job) => {
    logger.info(`Processing submission job ${job}`);
  },{
    connection: createNewRedisConnection(),
  });

  worker.on("completed", (job) => {
    logger.info(`Submission job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`Submission job ${job?.id} failed with error: ${err.message}`);
  });

  worker.on("closed", () => {
    logger.info("Evaluation worker closed");
  });
}

export async function startWorker() {
  await setupEvaluationWorker();
}
