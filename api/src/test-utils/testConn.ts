import { createConnection } from "typeorm";

import { PG_USER, PG_PASSWORD, PG_HOST } from "../Environment";

export const testConn = (drop: boolean = false) => {
  return createConnection({
    name: "default",
    type: "postgres",
    host: PG_HOST,
    port: 5432,
    username: PG_USER,
    password: PG_PASSWORD,
    database: "test",
    synchronize: drop,
    dropSchema: drop,
    entities: [__dirname + "/../../src/entities/*.*"]
  });
};
