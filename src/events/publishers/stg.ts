import { publishEvent } from "./base";
import { log } from "@/logging";

export async function publishRecognizeEvent(
  fileId: string,
  arrayBuffer: ArrayBuffer,
) {
  log.debug(`Publishing STG event for fileId: ${fileId}`);
  await publishEvent(`stg.${fileId}`, new Uint8Array(arrayBuffer));
}
