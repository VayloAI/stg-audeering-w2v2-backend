import { NatsClient } from "@vaylo/nats";

import config from "@/config";
import { log } from "@/logging";

const {
  nats: { servers, name },
} = config;

export async function init() {
  const client = new NatsClient({
    connection: {
      servers,
      name,
    },
    logger: log,
  });
  await client.connect();
  await client.initStream("example", ["example.*"]);

  return client;
}

export const client = await init();
