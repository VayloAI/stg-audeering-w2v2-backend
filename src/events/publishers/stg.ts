import { NatsPayload } from "@vaylo/nats/types/client";
import { publishEvent } from "./base";
import { log } from "@/logging";

export async function publishRecognizeEvent(fileId: string, data: NatsPayload) {
  log.debug(`Publishing STG event for fileId: ${fileId}`);
  await publishEvent(`stg.${fileId}`, data);
}
