import Express from "express";
import { createConnection } from "typeorm";
import Redis from "ioredis";

const app = Express();

const connectToRedis = () => {
  const redis = new Redis({
    host: "redis",
    port: 6379
  });

  return redis;
};

const connectToDatabase = async () => {
  let retryAttempts = 10;

  let connected: boolean = false;

  while (retryAttempts > 0 && !connected) {
    try {
      await createConnection({
        name: "default",
        type: "postgres",
        host: "db",
        port: 5432,
        username: "postgres",
        password: "postgres_password",
        database: "postgres",
        synchronize: true,
        logging: true,
        entities: ["src/entities/*.*"]
      });

      connected = true;

      retryAttempts--;
    } catch (e) {
      console.log(e);
    }
  }
};

const main = async () => {
  await connectToDatabase();

  let redis = connectToRedis();

  let g = await redis.set("set", 40);

  console.log("sdkfjsldfjld");
  console.log(g);

  app.listen(4000, () => {
    console.log("app running");
  });
};

main();
