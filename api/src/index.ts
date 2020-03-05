import "reflect-metadata";

import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import Express from "express";
import { verify } from "jsonwebtoken";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";

import { User } from "./entities/User";
import { CreateUser } from "./resolvers/CreateUserResolver";
import { LoginResolver } from "./resolvers/LoginResolver";
import { LogoutResolver } from "./resolvers/LogoutResolver";
import { Me } from "./resolvers/MeResolver";
import { SendMail } from "./resolvers/SendEmailResolver";
import { VerifyEmail } from "./resolvers/VerifyEmailresolver";
import {
  ENV,
  LOCAL_URL,
  PG_DATABASE,
  PG_HOST,
  PG_PASSWORD,
  PG_USER,
  REFRESH_TOKEN_SECRET
} from "./Environment";
import { createAccessToken } from "./utils/CreateAccessToken";
import { getRedis } from "./utils/Redis";
import { reportBug } from "./utils/ReportBug";
import { Payload } from "./types/Payload";

const whitelist =
  ENV === "development"
    ? ["http://localhost:3050", LOCAL_URL]
    : ["http://journal-env.rcpv566ppp.eu-west-2.elasticbeanstalk.com"];

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

app.get("/verify_email/:id", async (request, response) => {
  try {
    const idFromUrl = request.params["id"];

    const redis = getRedis();

    const userId = await redis.get(idFromUrl);

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return response.send(401);
    }

    user.verified = true;

    await user.save();

    return response.send(200);
  } catch (e) {
    return response.send(500);
  }
});

app.post("/refresh_token", (request, response) => {
  const jid: string | null = request.cookies["jid"];

  if (jid) {
    const payload = verify(jid, REFRESH_TOKEN_SECRET) as Payload;

    return response.send({
      token: createAccessToken(payload)
    });
  }

  return response.sendStatus(401);
});

const connectToDatabase = async () => {
  let retryAttempts = 10;

  let connected: boolean = false;

  while (retryAttempts > 0 && !connected) {
    try {
      const connection = await createConnection({
        name: "default",
        type: "postgres",
        host: PG_HOST,
        port: 5432,
        username: PG_USER,
        password: PG_PASSWORD,
        database: PG_DATABASE,
        synchronize: ENV === "development" ? true : false,
        logging: ENV === "development" ? true : false,
        entities: ["src/entities/*.*"]
      });

      connected = true;

      return connection;
    } catch (e) {
      retryAttempts--;

      if (ENV === "development" && /ECONNREFUSED/g.test(e.message)) {
        await new Promise(resolve => setTimeout(() => resolve(), 10000));
      }

      reportBug(e);
    }
  }
  return null;
};

const main = async () => {
  try {
    const connection = await connectToDatabase();

    try {
      await connection?.query(
        `kCREATE TABLE "user" ("id" SERIAL NOT NULL, "role" text NOT NULL DEFAULT 'USER', "email" text NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))"`
      );
    } catch (e) {
      console.log(e);
    }

    const schema = await buildSchema({
      resolvers: [
        VerifyEmail,
        SendMail,
        CreateUser,
        LoginResolver,
        Me,
        LogoutResolver
      ]
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
