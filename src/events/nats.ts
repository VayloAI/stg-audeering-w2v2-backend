import { NatsClient } from "@vaylo/nats";

import config from "@/config";
import { log } from "@/logging";

const {
  nats: { servers, name },
} = config;

export const streams = ["stg"] as const;
export type StreamItem = (typeof streams)[number];

export async function init() {
  const client = new NatsClient({
    connection: {
      servers,
      name,
    },
    logger: log,
  });

  await client.connect();
  for (const stream of streams) {
    await client.initStream(stream, [`${stream}.*`]);
  }

  return client;
}

export const client = await init();
