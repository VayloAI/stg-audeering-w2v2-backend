import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

import config from "@/config";
import { Database } from "./schema";
import { log } from "@/logging";

const {
  db: { name, user, password, host, port },
} = config;

const dialect = new PostgresDialect({
  pool: new Pool({
    database: name,
    user,
    password,
    host,
    port,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
  log(event) {
    if (event.level === "error") {
      log.error(
        {
          durationMs: event.queryDurationMillis,
          error: event.error,
          sql: event.query.sql,
          params: event.query.parameters,
        },
        "Query failed!",
      );
    } else {
      log.debug(
        {
          durationMs: event.queryDurationMillis,
          sql: event.query.sql,
          params: event.query.parameters,
        },
        "Query executed",
      );
    }
  },
});
