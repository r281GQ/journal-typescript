import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import Express from "express";
// import Redis from "ioredis";
// import { verify } from "jsonwebtoken";
// import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";

import { CreateUser } from "./resolvers/CreateUserResolver";
import { LoginResolver } from "./resolvers/LoginResolver";
import {
  // REDIS_HOST,
  // REDIS_PORT,
  PG_USER,
  PG_PASSWORD,
  PG_DATABASE,
  PG_HOST,
  ENV
  // REFRESH_TOKEN_SECRET
} from "./Environment";
import { reportBug } from "./utils/ReportBug";
// import { createAccessToken } from "./utils/CreateAccessToken";
// import { Payload } from "./types/apiContext/payload";

const whitelist = [
  "http://localhost:3000",
  "http://localhost:3050",
  "http://localhost:4000",
  "http://192.168.0.106:3050"
];

console.log(PG_USER);
console.log(PG_PASSWORD);
console.log(PG_DATABASE);
console.log(PG_HOST);

const app = Express();

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin!) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
);

app.use(cookieParser());

app.post("/refresh_token", (_request, response) => {
  // const jid: string | null = request.cookies["jid"];

  // if (jid) {
  //   const payload = verify(jid, REFRESH_TOKEN_SECRET) as Payload;

  //   return response.send({
  //     token: createAccessToken(payload)
  //   });
  // }

  return response.sendStatus(401);
});

// const connectToRedis = () => {
//   const redis = new Redis({
//     host: REDIS_HOST,
//     port: REDIS_PORT
//   });

//   return redis;
// };

const connectToDatabase = async () => {
  let retryAttempts = 10;

  let connected: boolean = false;

  while (retryAttempts > 0 && !connected) {
    try {
      // await createConnection({
      //   name: "default",
      //   type: "postgres",
      //   host: PG_HOST,
      //   port: 5432,
      //   username: PG_USER,
      //   password: PG_PASSWORD,
      //   database: PG_DATABASE,
      //   synchronize: true,
      //   logging: true,
      //   entities: ["src/entities/*.*"]
      // });
      // connected = true;
      retryAttempts--;
    } catch (e) {
      if (ENV === "development" && /ECONNREFUSED/g.test(e.message)) {
        await new Promise(resolve => setTimeout(() => resolve(), 10000));
      }

      reportBug(e);
    }
  }
};

const main = async () => {
  try {
    await connectToDatabase();

    // const redis = connectToRedis();

    // console.log(redis);

    const schema = await buildSchema({
      resolvers: [CreateUser, LoginResolver]
    });

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }) => {
        return { req, res };
      }
    });

    apolloServer.applyMiddleware({
      app,
      cors: false
    });
  } catch (e) {
    reportBug(e);
  }

  app.listen(4000, () => {
    console.log("app running");
  });
};

main();
