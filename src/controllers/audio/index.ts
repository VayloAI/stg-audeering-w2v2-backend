import { Elysia, t } from "elysia";

import { audioGenderFacade } from "@/facades/gender";
import { publishRecognizeEvent } from "@/events/publishers/stg";
import { GenderDataNotFound } from "@/errors";

// todo: move to protobuf with signature
export default new Elysia().group("/audio", (app) =>
  app
    .post(
      "/gender",
      async ({ body: { file } }) => {
        const arrayBuffer = await file.arrayBuffer();
        const fileId = Bun.hash(arrayBuffer).toString(16);
        const genderData = await audioGenderFacade.get(fileId);
        if (genderData) {
          return genderData;
        }

        const createdGenderData = await audioGenderFacade.create({
          file_id: fileId,
          status: "waiting",
        });

        await publishRecognizeEvent(fileId, arrayBuffer);

        return createdGenderData;
      },
      {
        body: t.Object({
          file: t.File({
            maxSize: "4m",
            description: "Small audio segment",
          }),
        }),
      },
    )
    .get(
      "/gender/:fileId",
      async ({ params: { fileId } }) => {
        const genderData = await audioGenderFacade.get(fileId);
        if (!genderData) {
          throw new GenderDataNotFound();
        }

        return genderData;
      },
      {
        params: t.Object({
          fileId: t.String({
            description: "File ID of recognized audio",
          }),
        }),
      },
    )
    .delete(
      "/gender/:fileId",
      async ({ params: { fileId } }) => {
        const genderData = await audioGenderFacade.delete(fileId);
        if (!genderData) {
          throw new GenderDataNotFound();
        }

        return genderData;
      },
      {
        params: t.Object({
          fileId: t.String({
            description: "File ID of recognized audio",
          }),
        }),
      },
    ),
);
