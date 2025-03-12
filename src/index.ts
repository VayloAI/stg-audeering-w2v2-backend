import { Elysia } from "elysia";
import { HttpStatusCode } from "elysia-http-status-code";

import config from "./config";
import { log } from "./logging";

import health from "./controllers/health";

const app = new Elysia({
  prefix: "/v1",
})
  .use(HttpStatusCode())
  .onError(({ code, error }) => {
    switch (code) {
      case "NOT_FOUND":
        return {
          detail: "Route not found :(",
        };
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
  .use(health)
  .listen({
    port: config.server.port,
    hostname: config.server.hostname,
  });

log.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
