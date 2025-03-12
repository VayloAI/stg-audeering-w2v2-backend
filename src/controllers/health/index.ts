import { Elysia } from "elysia";

import { HealthResponse } from "../../models/health.model";

export default new Elysia().group("/health", (app) =>
  app.get(
    "/",
    () => {
      return {
        status: "ok" as const,
      };
    },
    {
      response: {
        200: HealthResponse,
      },
    },
  ),
);
