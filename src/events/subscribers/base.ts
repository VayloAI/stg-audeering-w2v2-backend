import { NatsMessage } from "@vaylo/nats/types/client";

import { client } from "../nats";
import { log } from "@/logging";

export class BaseSubscriber {
  stream: string;
  name: string;
  constructor(stream: string, name: string) {
    this.stream = stream;
    this.name = name;
  }

  async handler(_msg: NatsMessage): Promise<unknown> {
    throw new Error("Not implemented");
  }

  async init() {
    log.info(`📡 Subscribing to '${this.stream}' as ${this.name}...`);
    const consumer = await client.getConsumer({
      stream: this.stream,
      name: this.name,
    });

    await client.consume(consumer, this.handler);
  }
}
