import { NatsPayload } from "@vaylo/nats/types/client";
import { client } from "../nats";

export async function publishEvent(subject: string, data: NatsPayload) {
  return await client.publish(subject, data);
}
