const DEFAULT_SALT = "1";
const DEAFULT_PG_PORT = "5432";
const DEFAULT_REDIS_PORT = "6379";

// salt to use with bcrypt
export const SALT = Number.parseInt(process.env.SALT || DEFAULT_SALT, 10);

// node.js environment
export const ENV = process.env.NODE_ENV;

// db connection
export const PG_USER = process.env.PGUSER;
export const PG_HOST = process.env.PGHOST;
export const PG_DATABASE = process.env.PGDATABASE;
export const PG_PASSWORD = process.env.PGPASSWORD;
export const PG_PORT = Number.parseInt(
  process.env.PGPORT || DEAFULT_PG_PORT,
  10
);

// redis connection
export const REDIS_HOST = process.env.REDISHOST;
export const REDIS_PORT = Number.parseInt(
  process.env.REDISPORT || DEFAULT_REDIS_PORT,
  10
);
