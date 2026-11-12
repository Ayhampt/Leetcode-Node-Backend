import { CPP_IMAGE, PYTHON_IMAGE } from "../constants.utils";
import { createNewDockerContainer } from "./createContainer.utils";
import { commands } from "./commands.util";
export interface RunCodeOptions {
  code: string;
  language: "python" | "cpp";
  timeout: number;
}

const allowListedLanguage = ["python", "cpp"];

export async function runCode(options: RunCodeOptions) {
  const { language, timeout, code } = options;

  if (!allowListedLanguage.includes(language)) {
    throw new Error("Language not allowed");
  }

  const container = await createNewDockerContainer({
    imageName: language === "python" ? PYTHON_IMAGE : CPP_IMAGE,
    cmdExecutable: commands[language](code),
    memoryLimit: 1024 * 1024 * 1024, // 1GB
  });
  const timeLimitExceeded = setTimeout(async () => {
    console.log("Time limit exceeded");
    await container?.stop();
  }, timeout);

  console.log("Container created successfully", container?.id);
  await container?.start();
  const status = await container?.wait();
  console.log("Container status", status);
  const logs = await container?.logs({
    stdout: true,
    stderr: true,
  });

  console.log("Container logs", logs?.toString());
  await container?.remove();

  if (status?.StatusCode == 0) {
    clearTimeout(timeLimitExceeded);
    console.log("Container exited successfully");
  } else {
    clearTimeout(timeLimitExceeded);
    console.log("Container exited with error");
  }
}
