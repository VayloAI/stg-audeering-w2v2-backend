import { NatsMessage } from "@vaylo/nats/types/client";

import { BaseSubscriber } from "./base";
import { log } from "@/logging";
import { recognize } from "@/tasks/stg";
import { audioGenderFacade } from "@/facades/gender";
import { AudioGenderUpdate } from "@/schemas/gender";
import { DetectProcessStatus } from "@vaylo/proto/stg";

/**
 * Every subscriber must be run separately.
 *
 * See `sub:custom` script in the package.json and add it in the same way
 */
const subcriber = new (class STGSubscriber extends BaseSubscriber {
  constructor() {
    super("stg", "vaylo-stg");
  }

  handler = async (msg: NatsMessage) => {
    const fileId = msg.subject.replace("stg.", "");
    log.info(`Received STG message for fileId: ${fileId}`);
    if (!fileId) {
      log.error(
        {
          subject: msg.subject,
        },
        "Failed to get fileId from message",
      );
      return;
    }

    const result = await recognize(msg.data);
    const data: AudioGenderUpdate = result
      ? {
          female_prob: result.female,
          male_prob: result.male,
          status: DetectProcessStatus.SUCCESS,
        }
      : {
          status: DetectProcessStatus.FAILED,
        };
    log.info(`Result of STG recognition: ${JSON.stringify(data)}`);

    await audioGenderFacade.update(fileId, data);
  };
})();

await subcriber.init();
