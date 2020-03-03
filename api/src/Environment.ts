// salt to use with bcrypt
export const SALT = Number.parseInt(process.env.SALT!, 10);

// access token for jwt
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY!;

// refresh token for jwt
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY!;

// node.js environment
export const ENV = process.env.NODE_ENV! as
  | "test"
  | "development"
  | "production";

// db connection
export const PG_USER = process.env.PGUSER!;
export const PG_HOST = process.env.PGHOST!;
export const PG_DATABASE = process.env.PGDATABASE!;
export const PG_PASSWORD = process.env.PGPASSWORD!;
export const PG_PORT = Number.parseInt(process.env.PGPORT!);

// redis connection
export const REDIS_HOST = process.env.REDISHOST!;
export const REDIS_PORT = Number.parseInt(process.env.REDISPORT!);

// utils
export const LOCAL_URL = process.env.LOCAL_URL!;
export const STAGING_URL = process.env.STAGING_URL!;
