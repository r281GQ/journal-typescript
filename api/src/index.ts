import "reflect-metadata";

import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import Express from "express";
import { verify } from "jsonwebtoken";
import { createConnection } from "typeorm";
import {
  ENV,
  PG_DATABASE,
  PG_HOST,
  PG_PASSWORD,
  PG_USER,
  REFRESH_TOKEN_SECRET,
  SELF_URL,
  SYNC
} from "./Environment";
import { createSchema } from "./utils/CreateSchema";
import { createAccessToken } from "./utils/CreateAccessToken";
import { formatError } from "./utils/FormatError";
import { reportBug } from "./utils/ReportBug";
import { Payload } from "./types/Payload";

const CORS_WHITE_LIST = [SELF_URL];

const app = Express();

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (CORS_WHITE_LIST.indexOf(origin!) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS."));
      }
    }
  })
);

app.use(cookieParser());

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
        synchronize: SYNC,
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
    await connectToDatabase();

    const apolloServer = new ApolloServer({
      schema: await createSchema(),
      context: ({ req, res }) => {
        return { req, res };
      },
      formatError: formatError
    });

    apolloServer.applyMiddleware({
      app,
      cors: false
    });
  } catch (e) {
    reportBug(e);
  }

  app.listen(4000, () => {
    console.log("API is listening on port 4000...");
  });
};

main();
