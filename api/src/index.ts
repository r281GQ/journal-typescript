import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import Redis from "ioredis";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";

import { CreateUser } from "./resolvers/CreateUserResolver";
import {
  REDIS_HOST,
  REDIS_PORT,
  PG_USER,
  PG_PASSWORD,
  PG_DATABASE,
  PG_HOST
} from "./Environment";
import { reportBug } from "./utils/ReportBug";

const app = Express();

const connectToRedis = () => {
  const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT
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
        host: PG_HOST,
        port: 5432,
        username: PG_USER,
        password: PG_PASSWORD,
        database: PG_DATABASE,
        synchronize: true,
        logging: true,
        entities: ["src/entities/*.*"]
      });

      connected = true;

      retryAttempts--;
    } catch (e) {
      reportBug(e);
    }
  }
};

const main = async () => {
  try {
    await connectToDatabase();

    const redis = connectToRedis();

    const schema = await buildSchema({
      resolvers: [CreateUser]
    });

    const apolloServer = new ApolloServer({ schema });

    apolloServer.applyMiddleware({ app });
  } catch (e) {
    reportBug(e);
  }

  app.listen(4000, () => {
    console.log("app running");
  });
};

main();
