import { t } from "elysia";

export const HealthResponse = t.Object({
  status: t.Literal("ok"),
});
