import { NatsMessage } from "@vaylo/nats/types/client";

import { BaseSubscriber } from "./base";
import { log } from "@/logging";

/**
 * Every subscriber must be run separately.
 *
 * See `sub:custom` script in the package.json and add it in the same way
 */
const subcriber = new (class ExampleSubscriber extends BaseSubscriber {
  constructor() {
    super("example", "vaylo-example");
  }

  async handler(msg: NatsMessage) {
    log.info(`${msg.seq}, ${msg.redelivered}, ${msg.string()}`);
  }
})();

await subcriber.init();
