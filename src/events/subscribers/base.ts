import { NatsMessage } from "@vaylo/nats/types/client";

import { client, StreamItem } from "../nats";
import { log } from "@/logging";

export class BaseSubscriber {
  stream: StreamItem;
  name: string;
  constructor(stream: StreamItem, name: string) {
    this.stream = stream;
    this.name = name;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  handler = async (_msg: NatsMessage): Promise<unknown> => {
    throw new Error("Not implemented");
  };

  async init() {
    log.info(`📡 Subscribing to '${this.stream}' as ${this.name}...`);
    const consumer = await client.getConsumer({
      stream: this.stream,
      name: this.name,
    });

    await client.consume(consumer, this.handler);
  }
}
