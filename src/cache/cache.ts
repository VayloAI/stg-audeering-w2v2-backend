import { Redis } from "ioredis";

import config from "@/config";

const {
  redis: { host, port, username, password },
} = config;
export const cache = new Redis({
  host,
  port,
  username,
  password,
});
