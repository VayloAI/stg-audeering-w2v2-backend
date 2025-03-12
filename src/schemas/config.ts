import { Type as t, type Static } from "@sinclair/typebox";
import { Config as LoggingConfig } from "@vaylo/pino/schema";
import { Config as NatsConfig } from "@vaylo/nats/schema";

export const ConfigSchema = t.Object({
  server: t.Object({
    port: t.Number({ default: 3000 }),
    hostname: t.String({ default: "0.0.0.0" }),
  }),
  nats: NatsConfig,
  cors: t.Object({
    allowedHeaders: t.String({ default: "*" }),
    origin: t.String({ default: "*" }),
    methods: t.String({ default: "GET, POST, OPTIONS" }),
    maxAge: t.Number({ default: 86400 }),
  }),
  db: t.Object({
    name: t.String({ default: "example-backend" }),
    host: t.String({ default: "127.0.0.1" }),
    port: t.Number({ default: 5432 }),
    user: t.String({ default: "postgres" }),
    password: t.String({ default: "postgres" }),
  }),
  redis: t.Object({
    host: t.String({ default: "127.0.0.1" }),
    port: t.Number({ default: 6379 }),
    username: t.String({ default: "default" }),
    password: t.String({ default: "" }),
    prefix: t.String({ default: "vaylob" }),
    ttl: t.Number({ default: 7200 }),
  }),
  logging: LoggingConfig,
});

export type ConfigSchemaType = Static<typeof ConfigSchema>;
