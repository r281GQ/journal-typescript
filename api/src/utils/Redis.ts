import Redis from "ioredis";

import { REDIS_PORT, REDIS_HOST } from "../Environment";

const client = new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST
});

export const getRedis = () => {
  return client;
};
