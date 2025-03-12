import * as path from "node:path";

import { Value } from "@sinclair/typebox/value";

import { ConfigSchema } from "@/schemas/config";

export default Value.Parse(ConfigSchema, {
  server: {
    port: Bun.env.SERVICE_PORT,
    hostname: Bun.env.SERVICE_HOST,
  },
  cors: {},
  nats: {
    name: "component_worker",
  },
  logging: {
    level: Bun.env.NODE_ENV === "production" ? "info" : "debug",
    logPath: path.join(__dirname, "..", "logs"),
    logToFile: Bun.env.LOG_TO_FILE === "true",
    loki: {
      host: Bun.env.LOKI_HOST,
      user: Bun.env.LOKI_USER,
      password: Bun.env.LOKI_PASSWORD,
      label: Bun.env.LOKI_LABEL,
    },
  },
  db: {
    name: Bun.env.POSTGRES_NAME,
    host: Bun.env.POSTGRES_HOST,
    port: Bun.env.POSTGRES_PORT,
    user: Bun.env.POSTGRES_USER,
    password: Bun.env.POSTGRES_PASSWORD,
  },
  redis: {
    host: Bun.env.REDIS_HOST,
    port: Bun.env.REDIS_PORT,
    username: Bun.env.REDIS_USER,
    password: Bun.env.REDIS_PASSWORD,
    prefix: Bun.env.REDIS_PREFIX,
    ttl: Bun.env.REDIS_TTL,
  },
});
