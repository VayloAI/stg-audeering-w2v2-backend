import { Elysia } from "elysia";
import { protobuf } from "elysia-protobuf";
import { fileTypeFromBuffer } from "file-type";
import {
  AudioGenderDetectRequest,
  AudioGenderDetectResult,
  AudioGenderSelectRequest,
  DetectProcessStatus,
} from "@vaylo/proto/stg";

import { audioGenderFacade } from "@/facades/gender";
import { publishRecognizeEvent } from "@/events/publishers/stg";
import { GenderDataNotFound } from "@/errors";
import config from "@/config";

const { secret, secretHeader } = config.server;

export default new Elysia().group("/audio-gender", (app) =>
  app
    .use(
      protobuf({
        signature: {
          enabled: true,
          headerName: secretHeader,
          secret,
        },
        schemas: {
          "detect.request": AudioGenderDetectRequest,
          "detect.result": AudioGenderDetectResult,
          "select.request": AudioGenderSelectRequest,
        },
      }),
    )
    .post(
      "/detect",
      async ({ body, headers, decode }) => {
        const { file } = await decode("detect.request", body, headers);
        const arrayBuffer = file.buffer.slice(
          file.byteOffset,
          file.byteOffset + file.byteLength,
        ) as ArrayBuffer;

        const fileType = await fileTypeFromBuffer(arrayBuffer);
        if (!fileType || fileType.mime !== "audio/wav") {
          throw new Error(
            "Unsupported file type. Only WAV files are supported.",
          );
        }
        const fileId = Bun.hash(arrayBuffer).toString(16);
        const genderData = await audioGenderFacade.get(fileId);
        if (genderData) {
          return genderData;
        }

        const createdGenderData = await audioGenderFacade.create({
          file_id: fileId,
          status: DetectProcessStatus.WAITING,
        });
        if (!createdGenderData) {
          throw new GenderDataNotFound();
        }

        await publishRecognizeEvent(fileId, file);

        return createdGenderData;
      },
      {
        parse: "protobuf",
        responseSchema: "detect.result",
      },
    )
    .post(
      "/cache",
      async ({ body, headers, decode }) => {
        const { file_id } = await decode("select.request", body, headers);
        const genderData = await audioGenderFacade.get(file_id);
        if (!genderData) {
          throw new GenderDataNotFound();
        }

        return genderData;
      },
      {
        parse: "protobuf",
        responseSchema: "detect.result",
      },
    )
    .delete(
      "/cache",
      async ({ body, headers, decode }) => {
        const { file_id } = await decode("select.request", body, headers);
        const genderData = await audioGenderFacade.delete(file_id);
        if (!genderData) {
          throw new GenderDataNotFound();
        }

        return genderData;
      },
      {
        parse: "protobuf",
        responseSchema: "detect.result",
      },
    ),
);
