import { publishEvent } from "./base";

export async function publishRecognizeEvent(
  fileId: string,
  arrayBuffer: ArrayBuffer,
) {
  await publishEvent(`stg.${fileId}`, new Uint8Array(arrayBuffer));
}
