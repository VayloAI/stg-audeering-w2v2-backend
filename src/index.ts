import { Elysia } from "elysia";
import { HttpStatusCode } from "elysia-http-status-code";
import { cors } from "@elysiajs/cors";
import {
  protobufParser,
  ProtoRequestError,
  ProtoResponseError,
} from "elysia-protobuf";

import config from "./config";
import { log } from "./logging";

import healthController from "./controllers/health";
import audioController from "./controllers/audio";
import { GenderDataNotFound, UnsupportedFileType } from "./errors";

export const app = new Elysia({
  prefix: "/v1",
})
  .use(HttpStatusCode())
  .use(cors(config.cors))
  .use(protobufParser())
  .error({
    GENDER_DATA_NOT_FOUND: GenderDataNotFound,
    UNSUPPORTED_FILE_TYPE: UnsupportedFileType,
    PROTO_RESPONSE_ERROR: ProtoResponseError,
    PROTO_REQUEST_ERROR: ProtoRequestError,
  })
  .onError(({ code, error, set, httpStatus }) => {
    switch (code) {
      case "NOT_FOUND":
        return {
          detail: "Route not found :(",
        };
      case "GENDER_DATA_NOT_FOUND":
        set.status = httpStatus.HTTP_404_NOT_FOUND;
        break;
      case "PROTO_REQUEST_ERROR":
      case "UNSUPPORTED_FILE_TYPE": {
        set.status = httpStatus.HTTP_400_BAD_REQUEST;
        break;
      }
      case "PROTO_RESPONSE_ERROR": {
        set.status = httpStatus.HTTP_500_INTERNAL_SERVER_ERROR;
        break;
      }
      case "VALIDATION":
        return error.all;
    }

    log.error(
      {
        message: (error as Error).message,
      },
      code as string,
    );

    return {
      error: (error as Error).message,
    };
  })
  .use(healthController)
  .use(audioController)
  .listen({
    port: config.server.port,
    hostname: config.server.hostname,
  });

log.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
