import express from "express";
import { serverConfig } from "./config";
import v1Router from "./routers/v1/index.router";
import v2Router from "./routers/v2/index.router";
import {
  appErrorHandler,
  genericErrorHandler,
} from "./middlewares/error.middleware";
import logger from "./config/logger.config";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware";
import { startWorker } from "./worker/evaluation.worker";
import { pullAllImages } from "./utils/container/pullimage.util";
import { createNewDockerContainer } from "./utils/container/createContainer.utils";
import { PYTHON_IMAGE } from "./utils/constants.utils";
const app = express();

app.use(express.json());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(attachCorrelationIdMiddleware);
app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);

/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);
  await startWorker();
  logger.info(`Worker started successfully`);
  await pullAllImages();
  logger.info(`All images pulled successfully`);

  await testPythonCode();
});
async function testPythonCode() {
  const pythonCode = `print("Hello from Python!")`;

  const runCommand = `echo '${pythonCode}' > code.py && python3 code.py`;

  const container = await createNewDockerContainer({
    imageName: PYTHON_IMAGE,
    cmdExecutable: ["/bin/bash", "-c", runCommand],
    memoryLimit: 1024 * 1024 * 1024, // 512MB
  });
  console.log(`Container created successfully :${container?.id}`);

  await container?.start();
  const status = await container?.wait();
  console.log("container status", status);

  const logs = await container?.logs({
    stdout: true,
    stderr: true,
  });
  console.log("container logs", logs?.toString());

  await container?.remove()
}
