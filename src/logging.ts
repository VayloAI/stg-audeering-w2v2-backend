import config from "@/config";
import { PinoClient } from "@vaylo/pino";

const { loki, level, logPath, logToFile } = config.logging;

export const loggerClient = new PinoClient({
  loki,
  level,
  logToFile,
  logPath,
});

await loggerClient.createLogDir();

export const log = loggerClient.init();
